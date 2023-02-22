import { Component, PropsWithChildren } from 'react'
import 'taro-ui/dist/style/index.scss'
import './app.scss'

class App extends Component<PropsWithChildren> {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
