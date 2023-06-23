import { $unfollowing } from './stores'

export const delay = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
/**
 * Scrolls down the following page
 * @param {number} delayMS - number of milliseconds to wait before scrolling down
 * @returns {boolean} - returns true if the end of the following section has been reached, false if not
 */
export async function scrollDownFollowingPage(delayMS = 3000) {
    // container holding all of the following profiles
    const followingSection = document.querySelector(
        'section > div[aria-label="Timeline: Following"]'
    ) as HTMLElement
    const lastHeight = followingSection.scrollHeight
    window.scrollTo({
        top: followingSection.scrollHeight,
        behavior: 'smooth',
    })

    await delay(delayMS) // wait for new content to load

    let newHeight = followingSection.scrollHeight
    console.log(
        `%c scrolling down: lastHeight: ${lastHeight}, newHeight: ${newHeight}`,
        `color: var(--su-green);`
    )
    if (newHeight === lastHeight) {
        return true // Reached the end of the document
    } else {
        return false // Not yet at the end of the document
    }
}

/**
 * Updates the unfollow button with the number of users selected
 */
export const setButtonText = () => {
    const button = document.getElementById(
        'superUnfollow-button'
    ) as HTMLButtonElement
    const { size } = $unfollowing.get()
    if (size > 0) {
        button.classList.add('active')
        button.innerText = `SuperUnfollow ${size} Users`
    } else {
        button.classList.remove('active')
        button.innerText = 'No Users Selected'
    }
}

/**
 * Logs a message with the callee function name and line number, and an optional object -- all with styling.
 * @param {string} message - the main message to log
 * @param {Eleemnt | Record<string, any> | null} object - optional object to log
 */
export function prettyConsole(
    message: string,
    object: Element | Record<string, any> | null = null
) {
    const messageStyle =
        'color: hsl(350, 79%, 74%); background-color: hsl(219, 100%, 39%); font-weight: bold; font-size: 1; padding: 5px;'
    console.log(`%c ${message}`, messageStyle)
    object && console.log(object)
}

export function waitForElement(
    selector: string,
    timeout = 4000
): Promise<HTMLElement | null> {
    return new Promise(function (resolve, reject) {
        const element = document.querySelector(selector) as HTMLElement
        if (element) {
            resolve(element)
            return
        }
        const observer = new MutationObserver(function (records) {
            records.forEach(function (mutation) {
                const nodes = Array.from(mutation.addedNodes)
                nodes.forEach(function (node) {
                    if (node instanceof HTMLElement) {
                        const innerElement = node.querySelector(
                            selector
                        ) as HTMLElement
                        if (node.matches(selector) || innerElement) {
                            console.log(selector + ' -> found')
                            observer.disconnect()
                            resolve(
                                node.matches(selector) ? node : innerElement
                            )
                        }
                    }
                })
            })
            // disconnect after
            setTimeout(function () {
                observer.disconnect()
                reject(new Error(selector + ' -> not found after 4 seconds'))
            }, timeout)
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    })
}
