# TODO

- [x] Update `src/controllers/transaction.controller.js`
  - [x] Fix idempotency handling for `idempotencyKey`
  - [x] Ensure mongoose transaction rollback on errors (`abortTransaction`)
  - [x] Remove nonexistent `Ledger.status` usage
  - [x] Make ledger creation + transaction completion atomic
  - [x] Fix email service call signature


- [x] Run quick node syntax check / start app
- [x] Smoke test endpoints for create transaction + idempotency



