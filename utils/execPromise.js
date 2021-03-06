const { exec } = require('child_process')

function execPromise(command) {
  return new Promise(function(resolve, reject) {
    console.debug({ command }, 'Executing {command}')

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }

      resolve(stdout.trim())
    })
  })
}

module.exports = execPromise
