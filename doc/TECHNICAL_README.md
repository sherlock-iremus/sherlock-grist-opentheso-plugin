
# Technical architecture

Main file is `src/handlers.ts`.

### `src/handlers.ts`

It contains handlers for :

- User DOM interactions
- Grist plugin events
- Opentheso API feedback

### `src/state.ts`

Global variables that should only be mutated in `src/handlers.ts`.

### `src/views/`

All DOM edition should be inside this folder.

### `src/controller/`

Controllers are called by handlers and dispatch orders to views and api

### Good practices

We followed next rules in this plugin development, for data integrity :
 
- Every change of state is in `src/handlers.ts` file.
- DOM cannot be edited by something else than `src/views/` files.
- `src/views/` cannot be called by anything else than controllers
- `src/controller/` cannot be called by anything else than handlers


# Plugin edition

`git clone https://github.com/sherlock-iremus/sherlock-data`

`cd sherlock-data/docs/grist_plugins/v2`

`npm run dev`

Do your modification then push to github.

The plugin should be accessible and integrable at the URL : `https://sherlock-iremus.github.io/sherlock-grist-opentheso-plugin/`
