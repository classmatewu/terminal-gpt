import COS from 'cos-nodejs-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  SecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

export async function putObject(option: Omit<COS.PutObjectParams, 'Bucket' | 'Region' | 'StorageClass'>) {
  const putObjectParams: COS.PutObjectParams = {
    ...option,
    Bucket: "",
    Region: "",
    StorageClass: "STANDARD"
  }

  return new Promise((resolve, reject) => {
    cos.putObject(putObjectParams, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}