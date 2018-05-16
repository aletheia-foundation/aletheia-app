
const path = window.require ? window.require('path') : null
const os = window.require ? window.require('os') : null
const fs = window.require ? window.require('fs') : null

export class FileHelper {


  public static toAbsoluteDownloadFilePath(title: string, extension: string) {
    return path.join(os.homedir(), 'Downloads', title.replace(/\W/, '-') + extension)
  }

  public static writeFileStream(stream, filePath) {
    const writeStream = fs.createWriteStream(filePath)
    stream.pipe(writeStream)
  }
}
