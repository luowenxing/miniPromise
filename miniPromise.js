(function(exports){

  var miniPromise = function(fn){
    var blockDefered ,value = null, status = 'pending'

    var resloveFunc = function(s){
      return function(val){
        status = s
        value = val
        setTimeout(function(){
            handle(blockDefered)
        },0)
      }
    }

    var handle = function(defered){
      if(status === 'pending') {
        blockDefered = defered
      } else if(defered) {
        if(status === 'fullfill') {
          var ret = defered.onFullfill && defered.onFullfill(value)
          if(ret && ret.then) {
            ret.then(function(val){
              defered.bridgeReslove(val)
            },function(reason){
              defered.bridgeReject(reason)
            })
            return
          } 
          defered.bridgeReslove(value)
        } else if(status === 'reject'){ // reject
          defered.onReject && defered.onReject(value)
          defered.bridgeReject(value)
        }
      }
    }

    this.then = function(onFullfill,onReject){
      return new miniPromise(function(bridgeReslove,bridgeReject){
        handle({
          onFullfill,
          bridgeReslove,
          onReject,
          bridgeReject
        })
      })
    }
    fn(resloveFunc('fullfill'),resloveFunc('reject'))
  }

  exports.miniPromise = miniPromise
})(window)
