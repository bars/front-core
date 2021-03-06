import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { create } from 'jss'
import preset from 'jss-preset-default'
import JssProvider from 'react-jss/lib/JssProvider'
import { createGenerateClassName, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import App, { createContainer } from './container'
import getPage from './pages'
import { init } from './actions'
import getStore from './store'
import ownRoutes from './pages/routes'

const generateClassName = createGenerateClassName()
const jss = create(preset())

const render = (Wrapper, Page, store, theme) => {
  const root = document.getElementById('app')
  const sCss = document.getElementById('server-side-styles')
  const sJs = document.getElementById('server-side-state')

  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <CssBaseline>
            <MuiThemeProvider theme={createMuiTheme(theme)}>
              <Wrapper>
                <Page />
              </Wrapper>
            </MuiThemeProvider>
          </CssBaseline>
        </JssProvider>
      </Provider>
    </AppContainer>,
    root,
    () => {
      if (sCss) sCss.remove()
      if (sJs) sJs.remove()
    }
  )
}

export const root = ({ title, routes, menu, layout = {}, apiRequests, config, theme }) => {
  const { store, reducers } = getStore({ ...ownRoutes, ...routes }, apiRequests)
  store.dispatch(init(config))

  const { Wrapper, ...layoutProps } = layout
  const Comp = Wrapper ? createContainer(Wrapper) : App
  const WrapComp = ({ children }) => (
    <Comp
      {...{
        title,
        menu,
        ...layoutProps,
        children,
      }}
    />
  )

  const Page = getPage({ store, reducers })
  render(WrapComp, Page, store, theme)

  if (__LOC__ && module.hot) {
    module.hot.accept('./pages', () => {
      const getNextPage = require('./pages').default
      const NextPage = getNextPage({ store, reducers })
      render(WrapComp, NextPage, store, theme)
    })
  }
}
