Baseline 2024 Feature: :has() Selector

For my baseline feature I used the :has() pseudo-class selector. This is a really useful selector that lets you style a parent element based on what's inside it. Before this we couldn't really do parent selectors in CSS without JavaScript.

I used it in three places in my stylesheet. First, I made sections that contain forms look different by giving them a gradient background and blue border. Second, sections with pictures get a different gradient style. Third, articles that have time elements get a thicker purple border on the left side.

This makes the code cleaner because I don't need to add extra classes to my HTML just to style parents differently based on their children. The :has() selector became widely available in 2023-2024 and is now supported in all modern browsers.
