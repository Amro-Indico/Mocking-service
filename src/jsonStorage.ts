import fs from 'fs'

/** A basic json-storage */
const jsonStorage = {
  filePath: 'db.json',
  init() {
    if (!fs.existsSync(this.filePath)) {
      this.write({})
    }
  },
  read() {
    const fileReader = fs.readFileSync(this.filePath)
    return JSON.parse(fileReader.toString())
  },
  write(obj: object) {
    fs.writeFileSync(this.filePath, JSON.stringify(obj, null, 2))
  },
  upsert(obj: object) {
    const before = this.read()
    const updated = { ...before, ...obj }
    this.write(updated)
    return updated
  },
}
jsonStorage.init()
export default jsonStorage
