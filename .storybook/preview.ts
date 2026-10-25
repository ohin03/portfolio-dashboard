import { createElement } from 'react'
import type { Preview } from '@storybook/react'
import '../src/app/globals.css'
import ThemeProvider from '../src/components/theme/ThemeProvider'

const preview: Preview = {
  decorators: [
    (Story) => createElement(ThemeProvider, null, createElement(Story)),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;