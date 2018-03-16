import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
export class FileHelper {

  public static toAbsoluteDownloadFilePath(title: string, extension: string) {
    return path.join(os.homedir(), 'Downloads', title.replace(/\W/, '-') + extension)
  }

  public static writeFileStream(stream, filePath) {
    const writeStream = fs.createWriteStream(filePath)
    stream.pipe(writeStream)
  }
}
