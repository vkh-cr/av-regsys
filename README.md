# Local work with source code
We use clasp command line tool here. To bound this project with prepared sheet document:

* Login to your dev google account (`clasp login`)
* Create new empty script project attached to this document (`clasp create <scriptTitle> <sheet_id_here>`)
* Review files to be pushed with `clasp status`
* `clasp push`
* Activate onFormSubmit trigger
  * sheet -> Tools -> Script editor -> Edit -> Current project's triggers -> create a new trigger
  * You need to grant permissions to the app under your account. This is called app verification. It will involve this nasty "go to ...(unsafe)" dialog
* Done

# Entry methods

## Registration submit (formHandler/onFormSubmit)
av19 done
1. Add column for var. symbol if not already present
1. Determines how much should be paid
1. Infer variable symbol for the registration and save it in sheet
1. Create an entry for expected payment in `money info` sheet
1. Send confirmation email to registrant

## Checking payments (bankHandler/onGetBankingDataTick)
av19 pending
1. Fetch statement from bank api for latest time period
1. Parse it and filter payments
1. Go through `money info` sheet and if variable symbol matches do this:
   1. Mark row in sheet as "needs attention" if payment is not in CZK
   1. Update `already paid` field in sheet
   1. Log pairing result in `bank log` sheet
   1. Sends an email to user (confirmation or more to pay)

## Checking non received payments (bankHandler/onCheckNotReceivedPayments)
av19 pending
(All non header rows in `money info` sheet).foreach:
1. Skip if `manual override` set to true
1. If not paid or long enough then send nudge email

## Sending equeued emails (commonUtils/onTryToSendEnqueuedEmailsTick)
av19 pending

## Manually inserting payment (uiAdditions/userPaidFunctionUI)
av19 pending
1. Prompts admin to enter variable symbol and amount paid
1. Find entry with var. symbol in `money info` sheet
1. Put email of logged in admin and amount into note of that payment for reference
1. Trigger pairing check as if this payment was read from bank

## Verifying bank connection (bankHandler/testBankAccess)
av19 done
1. Fetch statement from bank api for fixed time period
1. Parse it and filter payments
1. Log all payments into `bank log` sheet

## Test payment pairing (bankHandler/testBankWriteDown)
av19 pending
Exactly as `onGetBankingDataTick` but using static data instead of fetching.

