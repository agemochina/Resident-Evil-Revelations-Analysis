# Resident Evil: Revelations GSC (Ghost Ship Chaos) Weapon Drop Analysis

Analysis Basis
- Disassembly and GDB debugging of game code using IDA tools
- ROM file data parsing

PS: From the disassembled code, several places are named "gacha" (ガチャ/gacha). It seems Capcom has a clear understanding of this.

# Conclusion

TL;DR version: Conclusions first. The detailed analysis report follows.

- Weapon drop determination occurs at the results screen. Initialization and pickup do not trigger the check; only the results screen processes the "lottery" one by one.
- Weapon drops are random and unrelated to any metaphysical factors (playtime, kills, damage taken, full clear vs. speedrun, A or B, 7-weapon vs. 9-weapon runs, character name, character color, existing inventory, previous drop history...). These values do not participate in drop calculation in the code.
- **RareFinders** Effect: Has a massive increase on **Blue (BW=Lv51) rate** and **Full Slot rate**. RareFinders are stackable, and their order on weapon parts does not matter.
- **RareFinders** Do NOT Affect: Weapon type determination and Rare (Special Name) Tag determination. These are purely random and do not depend on RareFinders.
- The correct approach to get good drops is to equip as many RareFinders as possible, focus on loot more weapon cases. Other superstitions are useless. More cases opened = more chances for good items.

Probability Table (1 weapon case) (follow probabilities are for large-scale data, not individual lucky)
| Equip RareFinders | Lv51 (Blue) | Rare (Special Name) | FullSlot | Blue+Rare+Fullslots sametime |
| :------------- | :-----------: | :--------: | :------------: | :------------------: |
| 333 222 111    | 16.43%        | 1.5%       | 50%            | 0.12%                |
| 333 222 11     | 15.53%        | 1.5%       | 48%            | 0.11%                |
| 333 222 1      | 14.63%        | 1.5%       | 46%            | 0.10%                |
| 333            | 8.50%         | 1.5%       | 32%            | 0.04%                |
| None           | 1.49%         | 1.5%       | 14%            | 0.003%               |

In other words:
- Removing one or two of the smallest (+) RareFinders makes little difference, but try not to remove the (+++) or (++) high-level rarefinders. Equip as many as possible if you can.
- Equipping 7, 8, or 9 RareFinders  
    - On average: ~1.1 Blue per 7-weapon run, ~1.4 Blue per 9-weapon run.
    - On average: **1 Blue + Full Slot + Rare per 1000 weapon cases**.
    - On average: **1 Blue + Full Slot + Rare Magnum** (Python / L. Hawk / Pale Rider) per **10,000 weapon cases** (all magnum appearance rate is 9.5%).

# Drop Determination Steps

Weapon drop determination is a four-step process: WeaponID -> WeaponLevel -> Slots -> TAG
- **WeaponID**: First determines which weapon type drops. Note: The Rare (Special Name) is a Tag, not a separate weapon type.
- **WeaponLevel**: Determines the weapon level (Lv48, Lv49, Lv50, Lv51=BW=Blue).
- **Slots**: Determines the number of slots
- **TAG**: Determines the weapon tag (No tag; Various tags; Rare is also a TAG).

# Step 1: Weapon ID

First, decide which weapon type drops. Note: The Rare (Special Name) is a weapon tag (TAG), not a new Weapon ID.

Pseudo-code:
```C++
    float score = rand_float_n(100.0)
    int weapon_id = choose_weapon(score)
```
Explanation: First, a "score" is generated, i.e., a random float in the range [0.0, 100.0). Then, the weapon ID is obtained by looking it up from top to bottom in a table.
The weapon table is located in the ROM file: `archive\game\coop_table\weaponRate.lvt`. Original content:

| Weapon Name | Weapon ID  | Rate% |
| :---------- | :--------- | :---- |
| M92F        | 0x80051000 | 8.0   |
| Government  | 0x80051010 | 7.5   |
| G18         | 0x80051040 | 2.0   |
| PC365       | 0x80051060 | 7.0   |
| Python      | 0x80051100 | 5.0   |
| L.Hawk      | 0x80051110 | 3.0   |
| Pale Rider  | 0x80051120 | 1.5   |
| MP5         | 0x80051200 | 7.5   |
| P-90        | 0x80051210 | 6.0   |
| AUG         | 0x80051220 | 7.0   |
| G36         | 0x80051230 | 7.5   |
| High Roller | 0x80051250 | 2.0   |
| Windham     | 0x80051300 | 8.0   |
| M3          | 0x80051310 | 7.5   |
| Hydra       | 0x80051320 | 2.0   |
| Drake       | 0x80051330 | 1.5   |
| M40A1       | 0x80051400 | 8.0   |
| PSG1        | 0x80051410 | 7.5   |
| Muramasa    | 0x80051420 | 1.5   |

The probabilities in the above table sum to 100%. The lookup checks which interval the score falls into. Examples:
- Score=1.0 -> Lookup determines 0x80051000 M92F
- Score=25.0 -> Lookup determines 0x80051100 Python
- Score=30.0 -> Lookup determines 0x80051110 L.Hawk
- Score=99.0 -> Lookup determines 0x80051420 Muramasa

The only variable is the random `score` value. Once the `score` is determined, the weapon ID is determined, with no other influencing factors.

# Step 2: Weapon Level

Weapon Level determines the weapon level (Lv48 / Lv49 / Lv50 / Lv51=BW=Blue).

Pseudo-code:
```C++
    float score = rand_float_n(100.0)
    int weapon_level = choose_level(score, rare_finders)
```
Explanation: First, a "score" is generated -- a random float in the range [0.0, 100.0). Then, the weapon level is calculated.
The base data table is in the ROM file `archive\game\coop_table\weaponRarityRate.lvt`.

| Weapon Level (Additive) | Rate   |
|-------|--------|
| +0    | 0.8221 |
| +1    | 0.1084 |
| +2    | 0.0546 |
| +3    | 0.0149 |

`weapon_level` refers to the additive level (+0 ~ +3) relative to the base weapon level for the stage. The base level for Ghost Ship Chaos (GSC) is Lv48, so GSC weapons drop at Lv48~Lv51. From the table, Lv51 requires +3 with a base probability of only 0.0149 (1.49%). The actual in-game SP rate is not this low because equipped **RareFinders** have a massive increase on the rate.

The required random score threshold for a weapon case to get Lv51:

| RareFinders Count | Score Threshold | Note |
|------|--------| -------- |
| 9    | >=83.57| equipment of all RareFinders |
| 8    | >=84.47| remove 1 (+) RareFinders |
| 7    | todo| remove 2 (+) RareFinders |
| 3    | >=91.50| equipment only three (+++) RareFinders |
| 0    | >=98.51| No RareFinders, base rate 1.49% |

RareFinders come in three types: +, ++, +++. They are stackable(cumulative), order doesnt matter. Each type adds 1, 2, or 3 RF points respectively. For example, equipping all with RareFinders gives a RareFinders value (RF) = (1+2+3)*3 = 18 points.

every 1 point of RF increases Lv51 probability by approximately 0.83%.

Summary: Lv51 is independent of weapon type. It is determined purely based on a random score + RareFinders.

# Step 3: Number of weapon slots

Pseudo-code:
```C++
    float score = rand_float_n(100.0)
    int weapon_level = choose_slots(score, weapon_id, weapon_level, rare_finders)
```
Explanation: First, a "score" is generated -- a random float in the range [0.0, 100.0). Then, based on Weapon ID, whether its LV51 (BW), and RareFinders, the number of slots is calculated.

The slot probability table is in the last row of the ROM file `archive\game\coop_table\weaponSlotRate.lvt`.
| -2   | -1   | +0   | +1   | +2   |
|------|------|------|------|------|
| 0.09 | 0.22 | 0.41 | 0.14 | 0.14 |

LV51 (BW) weapons are guaranteed at least +1 slot.
Actual slot count = 1 + Weapon base slot count + Random adjustment (-2 ~ +2).
Game logic: Based on the random score, check which tier (-2 ~ +2) it falls into. A very low score falls into the negative tiers, meaning fewer slots than standard. For Magnums, every weapon (e.g., Python vs. L. Hawk) same for the algorithm, even though L. Hawk has 1 fewer base slot than Python. 

The above table is the base slot rate with **no RareFinders**. Equipping RareFinders significantly increases the Full Slot probability. **Each 1 point of RF value increases the probability by 2%**. That is:
```
Full Slot score threshold >= 100 - Base 14 - (RF points * 2)
```

The following table shows the score threshold for a Lv51(BW) Magnum (Python/Hawk/PaleRider) to be Full Slot, meaning the random number must be above this score:

| RareFinders Count | Score Threshold | Note |
|------|-------| -------- |
| 9    | >=50| equipment of all RareFinders |
| 8    | >=52| remove 1 (+) RareFinders |
| 7    | >=54| remove 2 (+) RareFinders |
| 3    | >=68| equipment only three (+++) RareFinders |
| 0    | >=86| No RareFinders |

# Step 4: TAG

The final step determines the tag. Note: The Rare (Special Name) is a weapon tag.

Pseudo-code:
```C++
    float score = rand_float_n(100.0)
    int tag = choose_tag(score)
```
Explanation: First, a "score" is generated, i.e., a random float in the range [0.0, 100.0). Then, the weapon tag is obtained by looking it up in a table. Once this score is determined, the weapon tag is determined.
The tag table is located in the ROM file: `archive\game\coop_table\weaponTagRate.lvt`. Original content:

| English Name | TAG Id     | Rate% |
| :----------- | :--------- | :---- |
| No TAG       | 0          | 50.0  |
| Short Range  | 0x80090000 | 5.0   |
| Long Range   | 0x80090001 | 5.0   |
| Easy Grip    | 0x80090002 | 5.0   |
| Speed Shot   | 0x80090003 | 5.0   |
| Steady Hand  | 0x80090004 | 5.0   |
| Speed Load   | 0x80090005 | 5.0   |
| Sonic Assist | 0x80090006 | 5.0   |
| Light Weight | 0x80090007 | 6.0   |
| Sonic Assist+| 0x80090008 | 2.5   |
| Short Range+ | 0x80090009 | 2.5   |
| Long Range+  | 0x8009000A | 2.5   |
| Rare         | 0x8009000B | 1.5   |

Example score values:
- 1.0 -> No tag
- 49.9 -> No tag
- 50.0 -> 0x80090000 Short Range
- 90.0 -> 0x80090007 Light Weight
- 98.4 -> 0x8009000A Long Range+
- 98.5 -> 0x8009000B Rare (Special Name)
- 99.0 -> 0x8009000B Rare (Special Name)
- 99.9 -> 0x8009000B Rare (Special Name)

Explanation: No tag is 50%, Rare (Special Name) is 1.5%. Only a random score >=98.5 will result in a Rare tag.
