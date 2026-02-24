/**
 * Author: agemo@163.com
 */

// ============== config ==============
var _MAX_LIMIT = 30 * 10000;

function config_limit_set(i) {
  _MAX_LIMIT = i;
}

function config_limit_get() {
  return _MAX_LIMIT;
}

// ============== RNG ==============
var G_CONTEXT = { state: [0, 0, 0, 0] };

function _rand_init_seed(ctx) {
  // 与 Python RNG 一致：val1=0x08501947CAB55256, val2=0xD9A8FDA25C500E44 -> state[0..3]
  ctx.state[0] = 0xcab55256;
  ctx.state[1] = 0x08501947;
  ctx.state[2] = 0x5c500e44;
  ctx.state[3] = 0xd9a8fda2;
}

function rand_init_seed() {
  _rand_init_seed(G_CONTEXT);
}

function _rand_uint32(ctx) {
  var w8 = ctx.state[0] >>> 0;
  var w9 = ctx.state[1] >>> 0;
  var w10 = ctx.state[3] >>> 0;

  w8 = (w8 ^ ((w8 << 15) & 0xffffffff)) >>> 0;
  ctx.state[0] = ctx.state[1];

  var w9_temp = ctx.state[2] >>> 0;
  var w10_temp = w10;

  w8 = (w8 ^ (w8 >>> 4) ^ w10_temp ^ (w10_temp >>> 21)) >>> 0;

  ctx.state[1] = w9_temp;
  ctx.state[2] = w10_temp;
  ctx.state[3] = w8;

  return w8;
}

function rand_uint32() {
  return _rand_uint32(G_CONTEXT);
}

function rand_skip(n) {
  n = n || 1;
  for (var i = 0; i < n; i++) rand_uint32();
}

function rand_backup_state() {
  return { state: G_CONTEXT.state.slice(0) };
}

function rand_restore_state(state) {
  G_CONTEXT = { state: state.state.slice(0) };
}

function rand_int_range(a, b) {
  var minVal = Math.min(a, b);
  var maxVal = Math.max(a, b);
  var range = maxVal - minVal + 1;
  var remainder = (rand_uint32() >>> 0) % range;
  return remainder + minVal;
}

function rand_int_range_by_uint32(a, b, randVal) {
  var minVal = Math.min(a, b);
  var maxVal = Math.max(a, b);
  var range = maxVal - minVal + 1;
  var remainder = (randVal >>> 0) % range;
  return remainder + minVal;
}

var NORMALIZE_CONSTANT = 2.328306436538696e-10;

function rand_float_n(n) {
  var random_uint = rand_uint32();
  var random_float = random_uint;
  var normalized = random_float * NORMALIZE_CONSTANT;
  return normalized * n;
}

// ============== weapon (from weapon.py) ==============
var weapon_table = [
  { id: 0x80051000, rate: 8.0, name: "M92F", rare_cn: "启示者", rare_en: "Revelator" },
  { id: 0x80051010, rate: 7.5, name: "Government", rare_cn: "独裁者", rare_en: "Dictator" },
  { id: 0x80051040, rate: 2.0, name: "G18", rare_cn: "杀戮者", rare_en: "Slaughter" },
  { id: 0x80051060, rate: 7.0, name: "PC365", rare_cn: "奇美拉", rare_en: "Chimaera" },
  { id: 0x80051100, rate: 5.0, name: "Python", rare_cn: "魔蛇", rare_en: "Serpent" },
  { id: 0x80051110, rate: 3.0, name: "L.Hawk", rare_cn: "雷霆之鹰", rare_en: "ThunderRaptor" },
  { id: 0x80051120, rate: 1.5, name: "PaleRider", rare_cn: "死神", rare_en: "GrimReaper" },
  { id: 0x80051200, rate: 7.5, name: "MP5", rare_cn: "掠夺者", rare_en: "Marauder" },
  { id: 0x80051210, rate: 6.0, name: "P90", rare_cn: "风暴之主", rare_en: "LeadStorm" },
  { id: 0x80051220, rate: 7.0, name: "AUG", rare_cn: "毒针", rare_en: "Stinger" },
  { id: 0x80051230, rate: 7.5, name: "G36", rare_cn: "侵略者", rare_en: "Aggressor" },
  { id: 0x80051250, rate: 2.0, name: "HighRoller", rare_cn: "赌徒二世", rare_en: "HighRollerII" },
  { id: 0x80051300, rate: 8.0, name: "Windham", rare_cn: "巨锤", rare_en: "Sledgehammer" },
  { id: 0x80051310, rate: 7.5, name: "M3", rare_cn: "突击者", rare_en: "Raider" },
  { id: 0x80051320, rate: 2.0, name: "Hydra", rare_cn: "地狱犬", rare_en: "Cerberus" },
  { id: 0x80051330, rate: 1.5, name: "Drake", rare_cn: "蛇龙", rare_en: "Lindwurm" },
  { id: 0x80051400, rate: 8.0, name: "M40A1", rare_cn: "野兔", rare_en: "Zaytsev" },
  { id: 0x80051410, rate: 7.5, name: "PSG1", rare_cn: "潜行者", rare_en: "Prowler" },
  { id: 0x80051420, rate: 1.5, name: "Muramasa", rare_cn: "零号", rare_en: "Zeroth" }
];

var tag_table = [
  { id: 0,          rate: 50.0, short_name: "无", name: "无标签", en_name: "No" },
  { id: 0x80090000, rate: 5.0, short_name: "短", name: "短射程", en_name: "ShortRange" },
  { id: 0x80090001, rate: 5.0, short_name: "长", name: "长射程", en_name: "LongRange" },
  { id: 0x80090002, rate: 5.0, short_name: "握", name: "轻松握力", en_name: "EasyGrip" },
  { id: 0x80090003, rate: 5.0, short_name: "射速", name: "高速射击", en_name: "SpeedShot" },
  { id: 0x80090004, rate: 5.0, short_name: "稳", name: "沉稳之手", en_name: "SteadyHand" },
  { id: 0x80090005, rate: 5.0, short_name: "填弹", name: "高速填弹", en_name: "SpeedLoad" },
  { id: 0x80090006, rate: 5.0, short_name: "音", name: "音速助攻", en_name: "SonicAssist" },
  { id: 0x80090007, rate: 6.0, short_name: "轻", name: "轻盈", en_name: "LightWeight" },
  { id: 0x80090008, rate: 2.5, short_name: "音+", name: "音速助攻+", en_name: "SonicAssist+" },
  { id: 0x80090009, rate: 2.5, short_name: "短+", name: "短射程+", en_name: "ShortRange+" },
  { id: 0x8009000A, rate: 2.5, short_name: "长+", name: "长射程+", en_name: "LongRange+" },
  { id: 0x8009000B, rate: 1.5, short_name: "稀有", name: "异名", en_name: "Rare" }
];

function weapon_name_table_str() {
  var ret = "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse; width: 100%;'><tr><th>武器名称 / Weapon Name (不区分大小写)</th></tr>";
  for (var i = 0; i < weapon_table.length; i++) {
    ret += "<tr><td>" + weapon_table[i].name + "</td></tr>";
  }
  ret += "</table>";
  return ret;
}

function weapon_by_name(name) {
  var lowerName = name.toLowerCase();
  for (var i = 0; i < weapon_table.length; i++) {
    if (weapon_table[i].name.toLowerCase() === lowerName) {
      return weapon_table[i];
    }
  }
  return null;
}

function weapon_by_score(score) {
  var cumulative_weight = 0;
  for (var i = 0; i < weapon_table.length; i++) {
    cumulative_weight += weapon_table[i].rate;
    if (cumulative_weight > score) {
      return weapon_table[i].name;
    }
  }
  throw new Error("invalid score " + score);
}

function tag_by_name(name) {
  var lowerName = name.toLowerCase();
  for (var i = 0; i < tag_table.length; i++) {
    if (tag_table[i].name.toLowerCase() === lowerName ||
        tag_table[i].en_name.toLowerCase() === lowerName ||
        tag_table[i].short_name.toLowerCase() === lowerName) {
      return tag_table[i];
    }
  }
  return null;
}

function tag_by_score(score) {
  var cumulative_weight = 0;
  for (var i = 0; i < tag_table.length; i++) {
    cumulative_weight += tag_table[i].rate;
    if (cumulative_weight > score) {
      return tag_table[i].name;
    }
  }
  throw new Error("invalid score " + score);
}

function tag_name_table_str() {
  var ret = "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse; width: 100%;'><tr><th>英文名 / English</th><th>中文名 / Chinese</th><th>简称 / Short</th></tr>";
  for (var i = 0; i < tag_table.length; i++) {
    ret += "<tr><td>" + tag_table[i].en_name + "</td><td>" + tag_table[i].name + "</td><td>" + tag_table[i].short_name + "</td></tr>";
  }
  ret += "</table>";
  return ret;
}

/**
 * Find smallest position > startPos+300 where lv51_fullslot_rare yields weaponName.
 * Logic from test_weapon.list_lv51_fullslot_rare.
 * @returns {number|null} position or null if not found
 */
function find_weapon_position_after(startPos, weaponName) {
  var MAX_LIMIT = config_limit_get();
  var minI = startPos;
  if (minI >= MAX_LIMIT) return null;
  rand_init_seed();
  rand_skip(minI);
  for (var i = minI; i < MAX_LIMIT; i++) {
    var state = rand_backup_state();
    var v1 = rand_float_n(100.0);
    var v2 = rand_float_n(100.0);
    var v3 = rand_int_range(0, 99);
    var v4 = rand_float_n(100.0);
    if (v2 >= 83.57 && v3 >= 50 && v4 >= 98.5) {
      var weapon = weapon_by_score(v1);
      if (weaponName && weapon.toLowerCase() === weaponName.toLowerCase()) {
        return i;
      }
    }
    rand_restore_state(state);
    rand_uint32();
  }
  return null;
}

// ============== amiibo ==============
var item_name_table = [
  { id: 0x80040101, name: "草药", short_name: "cy", en_name: "herb" },
  { id: 0x80040200, name: "手枪", short_name: "sq", en_name: "handgun" },
  { id: 0x80040204, name: "麦林", short_name: "ml", en_name: "magnum" },
  { id: 0x80040202, name: "机枪", short_name: "jq", en_name: "machine" },
  { id: 0x80040201, name: "散弹", short_name: "sd", en_name: "shotgun"  },
  { id: 0x80040203, name: "步枪", short_name: "bq", en_name: "rifle" },
  { id: 0x80051900, name: "手榴弹", short_name: "sld", en_name: "grenade" },
  { id: 0x80051950, name: "BOW", short_name: "bow", en_name: "bow" },
  { id: 0x80051940, name: "震撼", short_name: "zh", en_name: "shock" },
  { id: 0x80051960, name: "脉冲", short_name: "mc", en_name: "pulse" }
];

function item_name_table_str() {
  var ret = ""
  for (var i = 0; i < item_name_table.length; i++) {
    ret += item_name_table[i].short_name + " = " + item_name_table[i].name + " = " + item_name_table[i].en_name + "\n";
  }
  return ret;
}

var item_table_hi = [
  { id: 0x80040101, quantity: 2, weight: 2 },
  { id: 0x80040200, quantity: 18, weight: 2 },
  { id: 0x80040204, quantity: 4, weight: 2 },
  { id: 0x80040202, quantity: 50, weight: 2 },
  { id: 0x80040201, quantity: 9, weight: 2 },
  { id: 0x80040203, quantity: 7, weight: 2 },
  { id: 0x80051900, quantity: 2, weight: 2 },
  { id: 0x80051950, quantity: 2, weight: 2 },
  { id: 0x80051940, quantity: 2, weight: 2 },
  { id: 0x80051960, quantity: 2, weight: 2 },
  { id: 0x80040101, quantity: 4, weight: 8 },
  { id: 0x80040200, quantity: 30, weight: 8 },
  { id: 0x80040204, quantity: 8, weight: 8 },
  { id: 0x80040202, quantity: 70, weight: 8 },
  { id: 0x80040201, quantity: 14, weight: 8 },
  { id: 0x80040203, quantity: 12, weight: 8 },
  { id: 0x80051900, quantity: 4, weight: 8 },
  { id: 0x80051950, quantity: 4, weight: 8 },
  { id: 0x80051940, quantity: 4, weight: 8 },
  { id: 0x80051960, quantity: 4, weight: 8 }
];

var item_table_low = [
  { id: 0x80040101, quantity: 1, weight: 4 },
  { id: 0x80040200, quantity: 12, weight: 4 },
  { id: 0x80040204, quantity: 4, weight: 4 },
  { id: 0x80040202, quantity: 50, weight: 4 },
  { id: 0x80040201, quantity: 9, weight: 4 },
  { id: 0x80040203, quantity: 7, weight: 4 },
  { id: 0x80051900, quantity: 1, weight: 4 },
  { id: 0x80051950, quantity: 1, weight: 4 },
  { id: 0x80051940, quantity: 1, weight: 4 },
  { id: 0x80051960, quantity: 1, weight: 4 },
  { id: 0x80040101, quantity: 2, weight: 6 },
  { id: 0x80040200, quantity: 18, weight: 6 },
  { id: 0x80040204, quantity: 4, weight: 6 },
  { id: 0x80040202, quantity: 50, weight: 6 },
  { id: 0x80040201, quantity: 9, weight: 6 },
  { id: 0x80040203, quantity: 7, weight: 6 },
  { id: 0x80051900, quantity: 2, weight: 6 },
  { id: 0x80051950, quantity: 2, weight: 6 },
  { id: 0x80051940, quantity: 2, weight: 6 },
  { id: 0x80051960, quantity: 2, weight: 6 }
];

var CUR_TABLE = item_table_hi;

function get_name_by_id(id) {
  for (var i = 0; i < item_name_table.length; i++) {
    if (item_name_table[i].id === id) {
      return { name: item_name_table[i].name, short_name: item_name_table[i].short_name, en_name: item_name_table[i].en_name };
    }
  }
  return null;
}

function amiibo_set_hi(hi) {
  CUR_TABLE = hi ? item_table_hi : item_table_low;
  var poker_card = 0;
  for (var i = 0; i < CUR_TABLE.length; i++) {
    var info = get_name_by_id(CUR_TABLE[i].id);
    CUR_TABLE[i].name = info.name;
    CUR_TABLE[i].short_name = info.short_name;
    CUR_TABLE[i].en_name = info.en_name;
    CUR_TABLE[i].poker_card = String.fromCharCode(65 + poker_card);
    poker_card++;
  }
}

function amiibo_from_dict(item) {
  return {
    id: "0x" + item.id.toString(16),
    name: item.name,
    short_name: item.short_name,
    en_name: item.en_name,
    quantity: item.quantity,
    rate: item.weight,
    poker_card: item.poker_card || ""
  };
}

function amiibo_same(a, b) {
  return a.id === b.id && a.quantity === b.quantity;
}

function find_amiibo_by_name_and_quantity(name, quantity) {
  for (var i = 0; i < CUR_TABLE.length; i++) {
    var it = CUR_TABLE[i];
    if ((it.name === name || it.short_name === name || it.en_name == name) && it.quantity === quantity) {
      return it;
    }
  }
  return null;
}

function find_amiibo_by_rand(random_value) {
  var cumulative_weight = 0;
  for (var i = 0; i < CUR_TABLE.length; i++) {
    cumulative_weight += CUR_TABLE[i].weight;
    if (cumulative_weight > random_value) {
      return amiibo_from_dict(CUR_TABLE[i]);
    }
  }
  throw new Error("invalid random_value " + random_value);
}

function rand_amiibo(rnd) {
  var random_value;
  if (rnd !== undefined && rnd !== null) {
    random_value = rand_int_range_by_uint32(0, 99, rnd);
  } else {
    random_value = rand_int_range(0, 99);
  }
  return find_amiibo_by_rand(random_value);
}

function amiibo_parse_item(itemStr) {
  if (!itemStr || itemStr === "") return null;

  var first_digit_index = -1;
  for (var i = 0; i < itemStr.length; i++) {
    if (/\d/.test(itemStr[i])) {
      first_digit_index = i;
      break;
    }
  }

  if (first_digit_index === -1) {
    throw new Error("amiibo item bad format: " + itemStr + ". Expected 'name' followed by 'quantity'");
  }

  var name = itemStr.substring(0, first_digit_index);
  var quantity_str = itemStr.substring(first_digit_index);
  var quantity = parseInt(quantity_str, 10);
  if (isNaN(quantity)) {
    throw new Error("amiibo item bad quantity " + itemStr + ". Quantity must be number.");
  }

  var item = find_amiibo_by_name_and_quantity(name, quantity);
  if (!item) {
    throw new Error("amiibo item not found: " + name + " * " + quantity);
  }
  return amiibo_from_dict(item);
}

/**
 * @param {Array} seqs - 元素为 number(0=SKIP 或 raw uint32) 或 AmiiboItem
 * @param {function(string)} output - 每行输出回调，替代 print
 */
function match_sequence(seqs, output) {
  output = output || function () {};
  var MAX_LIMIT = config_limit_get();
  var MAX_OUTPUT = 20;
  var outCount = 0;

  for (var i = 0; i < MAX_LIMIT; i++) {
    var state = rand_backup_state();

    var all_match = true;
    for (var s = 0; s < seqs.length; s++) {
      var seq = seqs[s];
      if (typeof seq === "number") {
        if (seq === 0) {
          rand_uint32();
          continue;
        } else {
          var v = rand_uint32();
          if (v !== seq) {
            all_match = false;
            break;
          }
        }
      } else {
        var item = rand_amiibo();
        if (!amiibo_same(item, seq)) {
          all_match = false;
          break;
        }
      }
    }

    if (all_match) {
      if (outCount >= MAX_OUTPUT) {
        return;
      }
      var cur = rand_backup_state();
      var idx = i + 1;
      var used = seqs.length;
      var start = idx;
      var end = idx + used - 1;
      var curStr =
        cur.state[0].toString(16).toUpperCase().padStart(8, "0") +
        " " +
        cur.state[1].toString(16).toUpperCase().padStart(8, "0") +
        " " +
        cur.state[2].toString(16).toUpperCase().padStart(8, "0") +
        " " +
        cur.state[3].toString(16).toUpperCase().padStart(8, "0");
      //output("match @" + start + " ~ @" + end + " (+" + (end - start) + ") final state: " + curStr);
      output(end);
      outCount++;
    }

    rand_restore_state(state);
    rand_uint32();
  }
}

/**
 * 参考 test_amiibo_match.test_make_amiibo_by_idx_list
 * @param {string} list_str - 如 "idx,count" 或 "idx,-count"
 * @param {number} interval
 * @returns {{idx: number, amiibo: {short_name: string, quantity: number}}[]}
 */
function test_make_amiibo_by_idx_list(list_str, interval) {
  var parts = list_str.split(",").map(function (s) { return s.trim(); });
  if (parts.length !== 2) return [];
  var idx = parseInt(parts[0], 10);
  var max_count = parseInt(parts[1], 10);
  if (isNaN(idx) || isNaN(max_count)) return [];
  if (max_count < 0) {
    max_count = -max_count;
    idx = idx - (max_count - 1) * (interval + 1);
  }
  var result = [];
  rand_skip(idx - 1);
  for (var i = 0; i < max_count; i++) {
    var ret = rand_amiibo();
    result.push({ idx: idx, amiibo: { name:ret.name, en_name: ret.en_name, short_name: ret.short_name, quantity: ret.quantity } });
    rand_skip(interval);
    idx = idx + interval + 1;
  }
  return result;
}

/**
 * @param {Array} seqs - 追加到此数组
 * @param {number} interval
 * @param {string[]} amiibos - 例如 ["草药2", "机枪50"]
 */
function seqs_append_amiibo(seqs, interval, amiibos) {
  var idx = 0;
  for (var i = 0; i < amiibos.length; i++) {
    if (idx !== 0) {
      for (var skip = 0; skip < interval; skip++) {
        seqs.push(0);
      }
    }
    var item = amiibo_parse_item(amiibos[i]);
    if (!item || item.id === "0x0") {
      throw new Error("invalid amiibo");
    }
    seqs.push(item);
    idx++;
  }
}

/**
 * 匹配 Amiibo 序列（与 main.py 中调用方式一致）
 * @param {string} seq_str - 逗号分隔，如 "草药2，机枪50，手枪30"（支持全角逗号）
 * @param {number} interval - 间隔，如 16=emu 12=switch
 * @param {function(string)} output - 每行输出回调；不传则返回结果数组
 * @returns {string[]} 若未传 output，返回所有匹配行
 */
function test_match_amiibo_seq(seq_str, interval, output) {
  seq_str = seq_str.replace(/，/g, ",");
  var amiibos = seq_str.split(",").map(function (s) {
    return s.trim();
  }).filter(Boolean);

  if (amiibos.length < 5) {
    throw new Error("Sequence must have at least 5 items (got " + amiibos.length + ").");
  }

  var seqs = [];
  seqs_append_amiibo(seqs, interval, amiibos);

  var lines = [];
  var out = output || function (msg) {
    lines.push(msg);
  };
  match_sequence(seqs, out);

  if (!output) {
    return lines;
  }
}

/**
 * 匹配武器序列（参考 test_weapon.py 中的 test_match_weapon）
 * @param {string} values - 逗号分隔，如 "M40A1-短-0,MP5-装填-0"（支持全角逗号）
 * @returns {string[]} 返回匹配结果
 */
function test_match_weapon(values) {
  var weapon_list = values.replace(/，/g, ",").split(",");
  var seqs = [];
  if(weapon_list.length<3) {
    throw new Error("weapon list must at least 3 items (got " + weapon_list.length + ").");
  }

  for (var i = 0; i < weapon_list.length; i++) {
    var weapon = weapon_list[i].trim();
    var parsedValues = weapon.split("-");
    var name, tag, bw;

    if (parsedValues.length === 3) {
      name = parsedValues[0].trim();
      tag = parsedValues[1].trim();
      bw = parsedValues[2].trim();
    } else {
      throw new Error("weapon invalid: " + weapon);
    }

    // 验证名称
    if (!weapon_by_name(name)) {
      throw new Error("name invalid: " + name);
    }
    if (!tag_by_name(tag)) {
      throw new Error("tag invalid: " + tag);
    }

    seqs.push({
      name: name,
      tag: tag,
      bw: parseInt(bw, 10),
      maxslots: -1 // 任意满孔状态
    });

    // 两个武器id间隔 48111,48123(p90) = 12, 算上本身武器属性消耗的4个，那就是间隔8
    for (var skip = 0; skip < 8; skip++) {
      seqs.push(0);
    }
  }

  return match_weapon(seqs);
}

/**
 * 匹配武器序列（参考 test_weapon.py 中的 match_weapon）
 * @param {Array} seqs - 武器观察序列
 * @returns {string[]} 返回匹配结果
 */
function match_weapon(seqs) {
  var MAX_LIMIT = config_limit_get();
  var results = [];

  for (var i = 0; i < MAX_LIMIT; i++) {
    var state = rand_backup_state();

    var allMatch = true;
    var scores = "";
    var offset = 1;
    var lastWeaponOffset = -1;

    for (var j = 0; j < seqs.length; j++) {
      var seq = seqs[j];

      if (typeof seq === "number") {
        rand_uint32();
        offset = offset + 1;
        continue;
      }

      // 生成4个随机值
      var v1 = rand_float_n(100.0);
      var v2 = rand_float_n(100.0);
      var v3 = rand_int_range(0, 99);
      var v4 = rand_float_n(100.0);

      var name = weapon_by_score(v1);

      var bw = 0;
      if (v2 >= 83.57) {
        bw = 1;
      }

      if (name.toLowerCase() !== seq.name.toLowerCase() || bw !== seq.bw) {
        allMatch = false;
        break;
      }

      var tagName = tag_by_score(v4);
      var tagItem = tag_by_name(seq.tag);
      if (tagName.toLowerCase() !== seq.tag.toLowerCase() &&
          tagItem.short_name.toLowerCase() !== seq.tag.toLowerCase() &&
          tagItem.en_name.toLowerCase() !== seq.tag.toLowerCase()) {
        allMatch = false;
        break;
      }

      // 满孔检查（可选条件）
      var maxSlots = 0;
      if (v3 >= 50) {
        maxSlots = 1;
      }

      if (seq.maxslots >= 0 && maxSlots !== seq.maxslots) {
        allMatch = false;
        break;
      }

      if (scores) {
        scores += " | ";
      }
      lastWeaponOffset = i + offset;
      scores += "@" + (i + offset) + " " +
                Math.round(v1 * 10) / 10 + " " +
                Math.round(v2 * 10) / 10 + " " +
                v3 + " " +
                Math.round(v4 * 10) / 10;
      offset = offset + 4;
    }

    if (allMatch) {
      // 只显示最后的位置
      results.push(lastWeaponOffset);
    }

    rand_restore_state(state);
    rand_uint32();
  }

  return results;
}
