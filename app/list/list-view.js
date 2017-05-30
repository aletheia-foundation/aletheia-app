const $ = require('jQuery')

class ListView {
  renderPapers (papers){
    $('#papers-list').text(JSON.stringify(papers))
  }
}
module.exports = ListView
