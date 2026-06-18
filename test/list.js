import OSS from 'ali-oss';
consoel.log("23");
// OSS 配置接口地址
const OSS_CONFIG_API = 'https://auction-api.wekic.com/index.php';

console.log

// 从接口获取 OSS 配置
async function getOSSConfig() {
  const response = await fetch(OSS_CONFIG_API);
  const result = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(`获取 OSS 配置失败: ${result.message || '未知错误'}`);
  }
  
  return result.data;
}

// 创建 OSS 客户端
let client = null;
const BENCHMARK_FILE = 'benchmark/200mb.bin'; // 用于压测的固定大文件
const BENCHMARK_FILE_SIZE = 200 * 1024 * 1024; // 200MB

async function getOSSClient() {
  if (client) return client;
  
  const config = await getOSSConfig();
  client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    timeout: 600000, // 10 分钟超时
    retryMax: 3, // 重试 3 次
  });
  
  console.log(`[OSS] 配置已从接口获取，bucket: ${config.bucket}, region: ${config.region}`);
  return client;
}

// 确保压测文件存在，不存在则创建
async function ensureBenchmarkFile() {
  const ossClient = await getOSSClient();
  
  try {
    // 检查文件是否存在
    const headResult = await ossClient.head(BENCHMARK_FILE);
    const size = headResult.res.headers['content-length'];
    console.log(`[压测文件] 已存在: ${BENCHMARK_FILE}, 大小: ${(size / 1024 / 1024).toFixed(2)}MB`);
    return true;
  } catch (error) {
    if (error.code === 'NoSuchKey' || error.status === 404) {
      // 文件不存在，创建它
      console.log(`[压测文件] 不存在，正在创建 ${BENCHMARK_FILE} (200MB)...`);
      const buf = Buffer.alloc(BENCHMARK_FILE_SIZE); // 200MB 空文件
      await ossClient.put(BENCHMARK_FILE, buf);
      console.log(`[压测文件] 创建成功！`);
      return true;
    }
    throw error;
  }
}

// 循环下载单个大文件 - 最大化流量消耗
async function loopDownloadSingleFile(concurrency = 100, workerId = 1, maxRuntimeMinutes = 25) {
  const startTime = Date.now();
  const maxRuntimeMs = maxRuntimeMinutes * 60 * 1000;
  let totalBytes = 0;
  let downloadCount = 0;
  let running = 0;
  
  const ossClient = await getOSSClient();
  
  console.log(`[线程 ${workerId}] 开始循环下载 ${BENCHMARK_FILE}, 并发数: ${concurrency}\n`);
  
  // 下载一次的函数
  const downloadOnce = async () => {
    while (Date.now() - startTime < maxRuntimeMs) {
      try {
        const result = await ossClient.get(BENCHMARK_FILE);
        const size = result.content ? result.content.length : 0;
        totalBytes += size;
        downloadCount++;
        
        // 每 10 次输出一次
        if (downloadCount % 10 === 0) {
          const totalGB = (totalBytes / 1024 / 1024 / 1024).toFixed(3);
          const elapsed = (Date.now() - startTime) / 1000;
          const speedMBps = (totalBytes / 1024 / 1024 / elapsed).toFixed(2);
          console.log(`[线程 ${workerId}] 下载次数: ${downloadCount}, 总流量: ${totalGB}GB, 速度: ${speedMBps}MB/s`);
        }
      } catch (error) {
        // 遇到错误等待 1 秒后继续
        console.log(`[线程 ${workerId}] 下载出错，1秒后重试: ${error.message}`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  };
  
  // 启动并发下载
  const workers = Array.from({ length: concurrency }, () => downloadOnce());
  await Promise.all(workers);
  
  const totalGB = (totalBytes / 1024 / 1024 / 1024).toFixed(3);
  const elapsedMinutes = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`[线程 ${workerId}] 任务结束！下载次数: ${downloadCount}, 总流量: ${totalGB}GB, 耗时: ${elapsedMinutes}分钟`);
  
  return totalBytes;
}

// 单个线程的下载任务
async function workerTask(workerId, concurrency = 100, maxRuntimeMinutes = 25) {
  const startTime = Date.now();
  try {
    console.log(`[线程 ${workerId}] 开始时间: ${new Date().toISOString()}`);
    const totalBytes = await loopDownloadSingleFile(concurrency, workerId, maxRuntimeMinutes);
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    console.log(`[线程 ${workerId}] 结束时间: ${new Date().toISOString()}`);
    console.log(`[线程 ${workerId}] 总耗时: ${minutes} 分 ${seconds} 秒`);
    return totalBytes || 0;
  } catch (error) {
    console.error(`[线程 ${workerId}] 错误:`, error);
    throw error;
  }
}

// 上传大文件任务 - 优化版：并发上传
async function uploadHuge(maxRuntimeMinutes = 25, fileCount = 10000, fileSizeMB = 100, concurrency = 10) {
  const startTime = Date.now();
  const maxRuntimeMs = maxRuntimeMinutes * 60 * 1000;
  const buf = Buffer.alloc(1024 * 1024 * fileSizeMB);
  const ossClient = await getOSSClient();
  
  console.log(`[上传任务] 开始上传任务`);
  console.log(`[上传任务] 文件数量: ${fileCount}, 文件大小: ${fileSizeMB}MB, 并发数: ${concurrency}`);
  console.log(`[上传任务] 最大运行时间: ${maxRuntimeMinutes} 分钟`);
  console.log(`[上传任务] 开始时间: ${new Date().toISOString()}\n`);

  let uploaded = 0;
  let failed = 0;
  let running = 0;
  let index = 0;
  
  const uploadOne = async () => {
    while (index < fileCount) {
      const elapsed = Date.now() - startTime;
      if (elapsed >= maxRuntimeMs) break;
      
      const currentIndex = index++;
      try {
        const timestamp = Date.now();
        const random5digits = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const fileName = `bigfiles/${timestamp}${random5digits}.bin`;
        
        await ossClient.put(fileName, buf);
        uploaded++;
        
        // 每 10 个文件输出一次
        if (uploaded % 10 === 0) {
          const totalDataGB = ((uploaded * fileSizeMB) / 1024).toFixed(2);
          const avgSpeedMBps = ((uploaded * fileSizeMB) / ((Date.now() - startTime) / 1000)).toFixed(2);
          console.log(`[上传] 已上传: ${uploaded}/${fileCount}, 总数据: ${totalDataGB}GB, 速度: ${avgSpeedMBps}MB/s`);
        }
      } catch (error) {
        failed++;
      }
    }
  };
  
  // 启动并发上传
  const workers = Array.from({ length: concurrency }, () => uploadOne());
  await Promise.all(workers);

  const duration = Math.floor((Date.now() - startTime) / 1000);
  const totalDataGB = ((uploaded * fileSizeMB) / 1024).toFixed(2);
  const avgSpeedMBps = uploaded > 0 ? ((uploaded * fileSizeMB) / duration).toFixed(2) : '0';
  
  console.log(`\n[上传任务] ========================================`);
  console.log(`[上传任务] 上传完成！成功: ${uploaded}, 失败: ${failed}`);
  console.log(`[上传任务] 总数据量: ${totalDataGB}GB, 平均速度: ${avgSpeedMBps}MB/s`);
  console.log(`[上传任务] ========================================`);
}

// 主函数 - 同时执行上传和下载任务，最大化流量消耗
async function main() {
  try {
    // 从环境变量读取配置
    const maxRuntimeMinutes = parseInt(process.env.MAX_RUNTIME_MINUTES || '350', 10); // 默认 350 分钟（接近 6 小时）
    const enableDownload = process.env.ENABLE_DOWNLOAD !== 'false';
    const enableUpload = process.env.ENABLE_UPLOAD === 'true'; // 默认关闭上传
    const workerCount = parseInt(process.env.WORKER_COUNT || '3', 10); // 下载线程数
    const concurrencyPerWorker = parseInt(process.env.CONCURRENCY_PER_WORKER || '200', 10); // 每线程并发数
    const uploadFileCount = parseInt(process.env.UPLOAD_FILE_COUNT || '10000', 10);
    const uploadFileSizeMB = parseInt(process.env.UPLOAD_FILE_SIZE_MB || '100', 10);
    const uploadConcurrency = parseInt(process.env.UPLOAD_CONCURRENCY || '10', 10);
    
    const startTime = Date.now();
    console.log(`========================================`);
    console.log(`🚀 OSS 流量压测工具 - 优化版`);
    console.log(`========================================`);
    console.log(`下载任务: ${enableDownload ? '启用' : '禁用'}`);
    if (enableDownload) {
      console.log(`  - 线程数: ${workerCount}`);
      console.log(`  - 每线程并发: ${concurrencyPerWorker}`);
      console.log(`  - 总并发: ${workerCount * concurrencyPerWorker}`);
      console.log(`  - 模式: 循环下载（同一批文件反复下载）`);
    }
    console.log(`上传任务: ${enableUpload ? '启用' : '禁用'}`);
    if (enableUpload) {
      console.log(`  - 文件数: ${uploadFileCount}`);
      console.log(`  - 文件大小: ${uploadFileSizeMB}MB`);
      console.log(`  - 并发数: ${uploadConcurrency}`);
    }
    console.log(`最大运行时间: ${maxRuntimeMinutes} 分钟`);
    console.log(`开始时间: ${new Date().toISOString()}`);
    console.log(`========================================\n`);
    
    // 确保压测文件存在
    await ensureBenchmarkFile();
    
    const tasks = [];
    
    // 上传任务
    if (enableUpload) {
      tasks.push(uploadHuge(maxRuntimeMinutes, uploadFileCount, uploadFileSizeMB, uploadConcurrency));
    }
    
    // 下载任务 - 多线程循环下载
    if (enableDownload) {
      const downloadWorkers = Array.from({ length: workerCount }, (_, i) => 
        workerTask(i + 1, concurrencyPerWorker, maxRuntimeMinutes)
      );
      tasks.push(...downloadWorkers);
    }
    
    // 执行所有任务
    const results = await Promise.all(tasks);
    
    // 统计总流量
    const totalDownloadBytes = results.filter(r => typeof r === 'number').reduce((a, b) => a + b, 0);
    const totalDownloadGB = (totalDownloadBytes / 1024 / 1024 / 1024).toFixed(3);
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    console.log(`\n========================================`);
    console.log(`✅ 所有任务完成！`);
    console.log(`总下载流量: ${totalDownloadGB}GB`);
    console.log(`预估下载费用: ¥${(totalDownloadBytes / 1024 / 1024 / 1024 * 0.5).toFixed(2)}`);
    console.log(`结束时间: ${new Date().toISOString()}`);
    console.log(`总耗时: ${minutes} 分 ${seconds} 秒`);
    console.log(`========================================`);
  } catch (error) {
    console.error('主程序错误:', error);
    process.exit(1);
  }
}

main();
