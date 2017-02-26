(function(exports){
  var toArray = Function.prototype.call.bind(Array.prototype.slice)

  var miniPromise = function(fn){
    var defereds = [],
        status = 'pending',
        value = null

    var reslove = function(promise){
      status = 'fullfill'
      value = arguments
      setTimeout(() => {
        defereds.forEach( defered => {
            var ret = defered.onFullfill.apply(this,toArray(arguments))
            if(ret && ret.then ) {
              ret.then(function(){
                defered.bridgeFullfill.apply(this,toArray(arguments))
              })
            } else {
              defered.bridgeFullfill.apply(this,toArray(arguments))
            }
        },0)
      })
    }

    this.then = function(onFullfill){
      return new miniPromise(function(rsv){
        switch(status) {
          case 'pending':
            defereds.push({
              onFullfill:onFullfill,
              bridgeFullfill:rsv
            })
            break
          case 'fullfill':
            defereds.push({
              onFullfill:onFullfill,
              bridgeFullfill:rsv
            })
            reslove.apply(this,toArray(value))
          break
          case 'reject':
          break
        }
      })
    }

    fn(reslove)
  }
  exports.miniPromise = miniPromise
})(window)
