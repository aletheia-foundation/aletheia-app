const $ = require('jQuery')
const EventEmitter = require('events').EventEmitter

class ListView extends EventEmitter {
  constructor () {
    super()
    const self = this
    $('body').delegate('.download-paper','click', (e) => {
      const hash = $(e.target).attr('data-paper-hash')
      self.emit('clickDownloadPaper', hash)
    })
  }
  renderPapers (papers) {
    // todo: use a templating engine.
    var html = papers.map(paper => {
      return '<li><a href="javascript:;" class="download-paper" data-paper-hash="'
        + encodeURIComponent(paper)
        + '">'
        + encodeURIComponent(paper)
        + '</a></li>'
    }).join()
    console.log(html)
    $('#papers-list').html(html)
  }
}
module.exports = ListView
