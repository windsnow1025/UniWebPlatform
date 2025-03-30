# Guidelines

Update the 5 documents in this directory after every AI request, if necessary.

At the beginning of a project, these documents may be empty. As the user interacts with the AI and provides more details, the AI should extract relevant information from each request and update the appropriate document(s) accordingly.

Each AI request may also introduce changes to the app’s architecture or scope. If so, the AI must reflect those changes in the corresponding documents to ensure they always represent the current state of the project.

Also update the `./directory-structure.md` if changes are made.

1. PRD (Project Requirements Doc)

Start with this. It sets the tone.

Include:
• App overview
• User flows
• Tech stack & APIs
• Core features
• In-scope vs out-of-scope items

This gives the AI a solid high-level understanding of what you’re building.

2. App Flow Doc

This is the map of your app. The clearer it is, the better AI performs.

Break down:
• Describe every page in your app
• How users move from one to another
• Simple language, no bullets
• Be painfully specific

Avoid vagueness. AI get confused easily.

3. Tech Stack Doc

Tell the AI exactly what to build with.

List:
• All packages & dependencies
• Links to API docs (yes, it can read them)
• Preferred libraries or tools (e.g., Supabase, Stripe, NextAuth)

This keeps it from hallucinating random tech choices.

4. Frontend Guidelines

Give it your design system.

Include:
• Fonts
• Color palette
• Spacing & layout rules
• Preferred UI library or framework
• Icon set

If you want consistent design, you have to teach the AI your visual language.

5. Backend Structure Doc

Especially important if you’re using Supabase or Firebase.

Tell AI:

• DB schema
• Auth logic
• Storage rules
• Any edge cases

AI can write SQL, but only if it knows what you want it to store.
