import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import puppeteer from 'puppeteer'

const { tool, version } = await inquirer.prompt([
    {
        name: 'tool',
        type: 'string',
        message: "What's the name of the tool we've released?",
        default: 'cucumber-ruby'
    },
    {
        name: 'version',
        type: 'string',
        message: "Which version have we released?",
        default: 'v1.2.3'
    }
])

const spinner = ora({
    color: 'blue',
    text: 'Generating your announcement banner...'
}).start()

const url = new URL('./index.html', import.meta.url)
url.searchParams.append('tool', tool)
url.searchParams.append('version', version)
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto(url.toString())
await page.waitForSelector('.is-finished', { timeout: 1000 })
const element = await page.$('main')
await element.screenshot({ path: './screenshot.png' })
await page.close()
await browser.close()

spinner.succeed(`Screenshot saved to ${chalk.bgGray.whiteBright('screenshot.png')}!`)
