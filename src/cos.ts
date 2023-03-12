import COS from 'cos-nodejs-sdk-v5'

interface COSConfig {
  SecretId: string,
  SecretKey: string,
  Bucket: string,
  Region: string
}

let cos: COS | null = null;
let cosConfig: COSConfig | null = null

export function setCOSInstance(config: COSConfig) {
  cosConfig = config
  cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
  })
}

export async function putObject(option: Omit<COS.PutObjectParams, 'Bucket' | 'Region' | 'StorageClass'>) {
  const putObjectParams: COS.PutObjectParams = {
    ...option,
    Bucket: cosConfig.Bucket,
    Region: cosConfig.Region,
    StorageClass: "STANDARD"
  }

  return new Promise((resolve, reject) => {
    if (cos === null) {
      console.log("cos instance is null")
      resolve({})
      return
    }

    cos.putObject(putObjectParams, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}