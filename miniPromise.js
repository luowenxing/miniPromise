(function(export){
  var toArray = Function.prototype.call.bind(Array.prototype.slice)

  var miniPromise = function(fn){
    var doneList = [],
      status = 'pending',
      value = null

    var reslove = function(){
        status = 'fullfill'
        value = toArray(arguments)
        setTimeout(() => {
        doneList.forEach( e => e.apply(this,value))
        },0)
      }

    miniPromise.prototype.then = MPromise.prototype.then || function(onFullfill){
      switch(status) {
        case 'pending':
          fn(reslove)
          doneList.push(onFullfill)
          break
        case 'fullfill':
          onFullfill.apply(this,value)
        break
        case 'reject':
        break
      }
      return this
    }
  }

  var pMaker = function(){
    return new miniPromise(function(reslove){
      setTimeout(function(){
        reslove('timeOut',1000)
      },1000)
    })
  }

  var p1 = pMaker()
  var p2 = pMaker()


  setTimeout(function(){
    p1.then(function(data,timeOut){
      console.log('1:' + data + timeOut)
      return p2
    })
  },2000)

  export.miniPromise = miniPromise
})(window)
