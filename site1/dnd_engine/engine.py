import os, sqlite3, json, random, re, math
import sys

# --- BASE DIR ---
if "pyodide" in sys.modules:
    # running in Pyodide
    BASE_DIR = "/dnd_engine"
else:
    BASE_DIR = os.path.dirname(__file__)

DB = os.path.join(BASE_DIR, "srd.db")
HOME = os.path.join(BASE_DIR, "homebrew")

# --- DATABASE ---
def open_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def fetch(table, key):
    conn = open_db()
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {table} WHERE id=?", (key,))
    row = cur.fetchone()
    conn.close()
    if row: return dict(row)
    # homebrew fallback
    path = os.path.join(HOME, table, f"{key}.json")
    if os.path.exists(path):
        with open(path) as f: return json.load(f)
    return None

def list_ids(table):
    conn = open_db()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {table}")
    rows = [r["id"] for r in cur.fetchall()]
    conn.close()
    # homebrew
    hbdir = os.path.join(HOME, table)
    if os.path.isdir(hbdir):
        for f in os.listdir(hbdir):
            if f.endswith(".json"):
                rows.append(f[:-5])
    return rows

# --- DICE ---
def roll_die(sides): return random.randint(1,sides)
def parse_roll(expr):
    expr = expr.replace(" ","").lower()
    m = re.fullmatch(r"(\d+)d(\d+)([+-]\d+)?", expr)
    if not m: raise ValueError(f"Bad roll '{expr}'")
    n,s = int(m.group(1)), int(m.group(2))
    mod = int(m.group(3) or 0)
    return sum(roll_die(s) for _ in range(n)) + mod

def advantage_roll(): return max(roll_die(20), roll_die(20))
def disadvantage_roll(): return min(roll_die(20), roll_die(20))

# --- ENTITIES ---
class Entity:
    def __init__(self,table,key):
        self.table=table
        self.key=key
        self.data=fetch(table,key)
        if not self.data: raise ValueError(f"{table}.{key} not found")
    def get(self,k,default=None): return self.data.get(k,default)
    def __getitem__(self,k): return self.data.get(k)

def get_spell(n): return Entity("spells",n)
def get_monster(n): return Entity("monsters",n)
def get_class(n): return Entity("classes",n)
def get_race(n): return Entity("races",n)

# --- CHARACTER ---
class Character:
    def __init__(self,name,race,class_,level=1):
        self.name=name
        self.race=get_race(race)
        self.classes={class_:level}
        self.level=level
        self.hp=0
        self.hit_dice=[]
        self.abilities={"STR":10,"DEX":10,"CON":10,"INT":10,"WIS":10,"CHA":10}
        self.conditions=[]
        self.spell_slots={}
        self.calculate_hp()
    def calculate_hp(self):
        con_mod=(self.abilities["CON"]-10)//2
        hd_sum=sum(self.hit_dice) if self.hit_dice else 0
        self.hp=hd_sum+con_mod
    def add_xp(self,xp): pass

# --- COMBAT ---
class Combat:
    def __init__(self):
        self.turn_order=[]
        self.participants={}
    def add(self,entity): self.participants[entity.name]=entity
    def initiative(self):
        rolls={n:roll_die(20)+((c.abilities["DEX"]-10)//2) for n,c in self.participants.items()}
        self.turn_order=sorted(rolls,key=lambda x:rolls[x],reverse=True)
        return self.turn_order
    def attack(self,attacker,target,weapon_roll="1d6"):
        dmg=parse_roll(weapon_roll)
        tgt=self.participants[target]
        tgt.hp=max(0,tgt.hp-dmg)
        return dmg

# --- SPELLS ---
def spell_attack_roll(caster,adv=False,dis=False):
    mod=caster.abilities.get("CHA",0)
    if adv: return advantage_roll()+mod
    if dis: return disadvantage_roll()+mod
    return roll_die(20)+mod

def spell_save_dc(caster):
    return 8 + ((caster.abilities["INT"]-10)//2) + 2

def cast_spell(caster,spell_name,target=None):
    s=get_spell(spell_name)
    dmg_expr=s.get("damage") or "0d0"
    dmg=parse_roll(dmg_expr)
    if target:
        target.hp=max(0,target.hp-dmg)
    return dmg

# --- RESTS ---
def short_rest(char):
    hd_used=0
    while hd_used<len(char.hit_dice):
        char.hp+=roll_die(char.hit_dice[hd_used])+((char.abilities["CON"]-10)//2)
        hd_used+=1
    char.hit_dice=char.hit_dice[hd_used:]

def long_rest(char):
    char.calculate_hp()

# --- DM ---
class DM:
    def __init__(self,combat): self.combat=combat
    def set_hp(self,name,val):
        if name in self.combat.participants:
            self.combat.participants[name].hp=val
    def damage(self,name,val):
        if name in self.combat.participants:
            self.combat.participants[name].hp=max(0,self.combat.participants[name].hp-val)
    def heal(self,name,val):
        if name in self.combat.participants:
            self.combat.participants[name].hp+=val
    def add_condition(self,name,cond):
        if name in self.combat.participants:
            self.combat.participants[name].conditions.append(cond)
    def remove_condition(self,name,cond):
        if name in self.combat.participants and cond in self.combat.participants[name].conditions:
            self.combat.participants[name].conditions.remove(cond)
