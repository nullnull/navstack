require './setup'

testSuite 'Ready:', ->
  div = ->
    document.createElement('DIV')

  beforeEach ->
    @log = []

  beforeEach ->
    @stack = new Navstack
      transition: 'slide'

  beforeEach 'stub runTransition', ->
    sinon.stub @stack, 'runTransition', (a, dir, cur, prev, fn) =>
      setImmediate => @log.push 'transition'
      setImmediate fn

  describe '.transitioning', ->
    it 'becomes true after a push', ->
      @stack.push 'root', -> div()
      expect(@stack.transitioning).eql true

    it 'becomes false after transitions', (done) ->
      @stack.push 'root', -> div()
      @stack.ready =>
        expect(@stack.transitioning).eql false
        done()

  describe '.ready', ->
    it 'gives the correct sequence', (done) ->
      @log.push 'push'
      @stack.push 'root', -> div()
      @stack.ready =>
        expect(@log).eql ['push', 'transition']
        done()

    it 'can be called twice', (done) ->
      @log = []
      @stack.push 'root', -> div()
      @stack.ready => @log.push '1'
      @stack.ready => @log.push '2'
      @stack.ready =>
        expect(@log).eql ['1', '2']
        done()

