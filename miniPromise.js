(function(exports){
  var toArray = Function.prototype.call.bind(Array.prototype.slice)
  var isPromise = function(args) {
    if(args.length > 0 && args[0] instanceof miniPromise) {
      return args[0]
    }
    return null
  }

  var miniPromise = function(fn){
    var doneList = [],
        status = 'pending',
        value = null

    var reslove = function(){
      status = 'fullfill'
      var innerPromise = isPromise(arguments)
      if(innerPromise){
        innerPromise.then(function(){
          setTimeout(() => {
            doneList.forEach( e => e.apply(this,toArray(arguments)))
          },0)
        })
      } else {
        setTimeout(() => {
          doneList.forEach( e => e.apply(this,toArray(arguments)))
        },0)
      }
    }

    var handle = function(defered) {
      switch(status) {
        case 'pending':
          doneList.push(defered.onFullfill)
          break
        case 'fullfill':
          var retPromise = defered.onFullfill.apply(this,value)
          defered.reslove(retPromise)
        break
        case 'reject':
        break
      }
    }

    miniPromise.prototype.then = miniPromise.prototype.then || function(onFullfill){
      return new miniPromise(function(reslove){
        handle({
          onFullfill:onFullfill || null,
          reslove:reslove
        })
      })
    }
    fn(reslove)
  }
  exports.miniPromise = miniPromise
})(window)
