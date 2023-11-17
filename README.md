# Trickle CSS

Learn the cascade one step at a time.

---

## Contributing

First of all, thanks for taking the time to contribute!

All types of contributions are welcome, from bug fixes, fulfilling on new feature requests, and even creating new challenges for users to solve! Please create an issue for new feature discussions so they can be outlined and decided upon before implementation.

### Creating a Challenge

To create a new challenge, please create a PR that adds a new `.ts` file to `src/lib/data/challenges`, such as `src/lib/data/challenges/pizza.ts`. This file should have a default export that matches the expected config. Since it is a `.ts` file and not simple `.json`, you can use functions and helpers to construct your challenge.

#### Challenge Config

- `title` (string): The title of the challenge, visible in the list and at the top of the challenge page.
- `slug` (string): The URL slug, visible when visiting `/challenges/{slug}`.
- `intro` (string): A description of what the challenge is all about.
- `startingStyles` (string): Some styles that will appear when the user first loads the challenge, or if they click the "Reset" button.
- `markup` (string): The HTML and CSS that should be unchangeable. Add attributes such as `id` and `class` for users to select in their styles. Please also leave comments if needed to help the user understand what the code does.
- `tasks` (Task | Task[]):

#### Task Config

- `text` (string): What the user should do to accomplish the task.
- `requirement` (Requirement | Requirement[]): One or more requirements that will be validated for completion.

#### Requirement Config

- `selector` (string): Which CSS selector should be targeted.
- `pseudoSelector` (string; not required): Which CSS pseudo-selector should be targeted. Since they are not real, targettable elements in JS, we need to take a different approach using this field.
- `property` (string): Which property to validate.
- `type` ('literal' | 'unit'): Whether a fixed string (like `translateX(2px)`) should be used or a unit (like `2rem`) for validation. Users' entered units will be converted to the same one you enter in `value`, so they could correctly enter `2rem` and you could specify `32px` if the base font size is `16px`.
- `source` ('exact' | 'computed'; not required and defaults to 'computed'): Whether the exact value or the computed value should be tested. This is important when working with browser calculations.
- `comparator` ('>' | '>=' | '<' | '<=' | '==' | '!='; not required and defaults to '=='): How to compare the user-entered value with the expected value.
- `value` (string): The expected value.

Here are some more things to be aware of:

- The user-entered styles are ran through DOMPurify to prevent malicious code execution, but the `markup` value provided by contributors is not.

## Security

The security of the users is of utmost importance. DO NOT submit a change with malicious intent. DO NOT paste in code you contribute unless you know what it does. DO NOT pull in arbitrary dependencies. Seek the help of project owners if you are unsure about the security implications of your contributions. If something is not sufficiently safe, we will provide a reason why as well as tips on how to mitigate the issue.

## Developing

Please submit PRs against the `dev` branch. Once ready, merges to `main` will trigger a deployment.

Once installed dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of the app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.
