# [Switch Platform] Resident Evil Revelations 1: Serpent Is Not a Dream -- "RNG Manipulation" to Get Any Desired Rare Weapon

Regarding the blue background, max slot, rare weapons in *Revelations 1*, everyone knows the drop rate is extremely low. Here, I'm sharing a method to precisely obtain desired items by manipulating the game's RNG, without modifying the game on a legitimate console.

**This method can be considered a "backdoor." Whether you approve is a matter of personal perspective. If you don't enjoy this playstyle, please feel free to close this video/article.**

This method is original personal research, intended solely for technical exchange and learning. Please do not use it for any commercial purposes.

## Principle: Why Can Drops Be "Controlled"?

Many people think in-game drops are purely random, but that's not true. This game, like most, uses **pseudo-random numbers**. Simply put, the game calculates a "random number sequence" based on formulas, much like a book of near-infinite thickness. The result you see depends on which page you turn to. Because the gameplay involves numerous variables, the "page" you turn to changes constantly, leading to different outcomes. If we could find the specific "page" corresponding to a desired weapon drop and turn to it in advance, we could guarantee the drop. This is the core logic of this method.

To achieve this, we need to understand a few concepts:

1.  **Current RNG Position**: Which page of the book are we on right now?
2.  **Target RNG Position**: Which page in the book contains the "desired weapon drop" you want?
3.  **Alignment**: By consuming random numbers (turning pages), we make the "current page" align with the "target page".
4.  **Methods to Consume RNG**: Numerous game elements use RNG: enemy/player actions, button presses, and even the background (approx. 150 times/second). Importantly, **when paused in single-player**, background RNG consumption stops, leaving only menu button presses. This is key to precise control.

## Preparation: You Need an "Unlimited Use Amiibo -- amiibo emulator"

To "see" which page you're on, you need a reference point for observation. The most convenient reference in the game is the **amiibo**. By continuously scanning the amiibo multiple times and inputting the results into a website, we can deduce the current RNG position.

You must have an **amiibo emulator**, not the regular one that can only be used once per day. Unlimited-use amiibos are available online. Whether it has a backlight or not doesn't matter. It's best to get one that can be set to Mega Man.

Characters:
-   **Recommended: Mega Man** (Capcom character). offering good supplies and high distinction(20 kind of possible items). 6 consecutive scans yield a 1% error rate.
-   **If you don't have Mega Man**: Other characters are also usable. They have 16 possible items, with slightly lower distinction. 6 consecutive scans yield a 2% error rate.

> **Note**: The website defaults to "Mega Man." If you are using a different amiibo, you need to switch the setting to "Other."

## Core Process

### Step 1: Equipment and Route
1.  **Console**: Switch 1 / Switch 2 are both fine.
2.  **Equipment**: You **must** equip 9 RareFinders. (The website algorithm assumes 9 RareFinders).
3.  **Hard Reset**: You must fully close the game (terminate game process from background) and restart it before each run. This resets the RNG seed, ensuring the random sequence starts from the beginning every time.
4.  **Route**: Kitchen -> Casino -> Observation Deck (finish). A and B can work, but B is easier to success.

### Step 2: Measuring the Position

After clearing the Observation Deck(inlcude Aculeozzo), ensure your character is not in a running state and no effects like electric shocks are active. Pause the game and continuously scan the amiibo **6 times** , then input to website to measure the current RNG position:
-   **Random is out of control**: This run has failed. You must hard reset and restart.
-   **Successful Measurement**: Congratulations. Although it still involves some luck (success rate about 5%), it's still hundreds of times easier than normally obtaining a Serpent.
-   **Note**: Successfully measured RNG positions are around 150,000+. It's recommended to measure 7 or more consecutive times amiibo to ensure it's not a false positive.

### Step 3: Consuming RNG to Approach the Target
The website will tell you how far you are from the target weapon (i.e., how many RNG values need to be consumed).
From the **pause menu**, you can precisely control RNG consumption using these methods:
-   **Press left joystick Up/Down once**: Consumes 2.
-   **Hold left joystick Up/Down continuously**: Consumes about 500 per minute (good for long distances).
-   **Press A to open any submenu or pop-up**: Consumes 4.
-   **Scan an amiibo once**: Consumes 13 (mainly from button presses and menu pop-ups).
-   **Special Note**: Locking/unlocking the screen or pressing the Home button to do other things consumes **no** RNG. Switch doesn't kill background apps.

The typical approach is: **consume and measure iteratively**. Press Up for a while, measure again, and gradually get closer to the target.

### Step 4: Alignment & Reward
When you are close to the "target RNG position" (distance less than 500), follow the instructions calculated by the website. **Strictly follow the instructions** and finally open the crate to collect your reward.
Congratulations! Your desired weapon should now appear!

## Some Experience Regarding "Random is out of control"

Out of control means the RNG sequence becomes unpredictable. The exact cause is unknown, so this method still requires some luck. Looking at the code, it's likely a game issue, possibly a bug related to multi-threaded race conditions when writing RNG values.

Miscellaneous
- Both A and B can succeed, but experience suggests B has a slightly higher success rate.
- Switch 1 / Switch 2 both work.

Current Verified Conclusions
- **Main Likely Cause**: The moment you open a door, and the room on the other side already has spawned enemies. This is uncontrollable and depends purely on luck.
- **Secondary Possible Cause**: Being in combat or moving while enemies are present. When a Ooze-Chunk explodes and spawns many new enemies, issues can also arise.
- Rooms with no enemies will never out of control, regardless of actions taken.

The area with the highest out of control probability is the path from the Kitchen into the pipes. If there are enemies, each door opening moment carries a failure risk. The longer enemies remain alive in a room, the higher the chance of problems. Therefore, consider the following approach:
- In the U way, use BOW Try not to let Ooze-Chunk explode. If it do, clear them quickly.
- Clear the room before the Kitchen quickly.
- Clear the Kitchen quickly.
- On the second return to the U way heading towards the elevator, kill the Aculeozzo as far away as possible, ideally with an shock grenade.
- Getting off the elevator is hard. this is purely depends on luck.
- After getting off the elevator, clear all 6 enemies before water. After clearing them, you can measure with the amiibo inside the pipes. If out of control, restart the run. If not, the run is mostly successful.
- Clear the Casino quickly. Kill the Aculeozzo before opening the steering wheel door.
- Clear the Observation Deck quickly. Kill the Aculeozzo.

Additionally, using the Pulse Grenade frequently is helpful. When it stuns enemies, they consume less RNG, making the process safer.

## Amiibo Usage hints

All the following errors will cause alignment/measurement to fail. You will need to re-measure 5 times to realign. If you have already passed the target by then, you'll have to use the next weapon drop position.

some hints to avoid errors:
1.  **Must Remove After Each Scan**: After scanning the amiibo each time, you must remove it from the controller's NFC read area. Scanning it repeatedly without removing can cause the game to error, saying "This amiibo cannot be used again today."
2.  **Wait 3 Seconds Between Scans**: Leave a gap of a few seconds between scans. Scanning too quickly can also trigger the "cannot be used again today" error.
3.  **Select Correct Menu Option**: The menu option for the unlimited-use amiibo emulator must be selected correctly, otherwise it will error with "That's not an amiibo."
4.  **Scanning Fails**: If you encounter a situation where it won't scan, try pressing the Home button to return to the main menu, then switch back to the game. It should scan then.

## Final Friendly Reminders (Avoiding Bans/Restrictions)

Although this is a single-player method and doesn't require hacking, to avoid any extreme scenarios where the official might take issue (e.g., regarding the use of unlimited-use amiibos), it's advisable to:
- **Stay Offline**: Activate Airplane mode, enable NFC, amiibo scanning still works.
- **Protect Your Privacy**: If you share screenshots of your obtained weapons online, **remember to blur/mosaic any part showing your Re.net account name.**
