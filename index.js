var fs = require('fs')
var args = Array.prototype.slice.call(process.argv, 2)
console.log(args)
var fileName = "./version-next-week.js";
fs.readFile(fileName, 'utf8', function (err, data) {
    let regAMD = /define\((?:"[.\s]*",)?(\[\s*(?:[^\]\s]+(?:\s*?))*\s*\])\s*,\s*function\s*(\(\s*(?:\w*,?\s*)*\))\s*(\{(?:.*\s*)*\})\)/;
    result = regAMD.exec(data);
    if(!result){
        console.log('the file does not match AMD format')
        return ;
    }
    var pathString = result[1];
    var parameterString = result[2];
    var params = parameterString.match(/\w+/g)
    var paths = pathString.match(/['"][\w\/-]*['"]/g)
    var commonjsDeclare = params.map(function (param, index) {
            return `var ${param} = require(${paths[index] || ''});`
        })
        .join('\r\n') + '\r\n'+'module.exports = '
    var commonjsFile = data.replace(regAMD, `${commonjsDeclare} (() => $3)()`)
    var newFileName = fileName.replace(/\.js/g, '.cmd.js')
    console.log('newFileName after:\r\n', commonjsFile);
    fs.writeFile(newFileName, commonjsFile,
        err => {
            if (err) throw err;
            console.log('The file has been saved!');
        })
})
