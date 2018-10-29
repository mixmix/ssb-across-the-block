var pull = require('pull-stream')

const relatedMessages = []
const msgKey = '%n2iq29AiNz7Z83i5VboY0izsoADQlYfbxBGrRcATGCg=.sha256'

module.exports = function getBacklinks (server) {
  return function (data, donecb) {
    function createBacklinkStream (id) {
      var filterQuery = {
        $filter: {
          dest: id
        }
      }
      return server.backlinks.read({
        query: [filterQuery],
        index: 'DTA',
        live: true
      })
    }

    pull(
      createBacklinkStream(msgKey),
      pull.filter(msg => !msg.sync),
      pull.drain(msg => {
        relatedMessages.push(msg)
      }),
      donecb(null, data)
    )
  }
}
