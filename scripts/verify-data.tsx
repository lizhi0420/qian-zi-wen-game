import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UNITS_DATA, PERIODS_DATA } from '../src/data/qianziwenData';
import { getTone, generateToneVariants } from '../src/utils/pinyin.js';
import { HomeView } from '../src/components/HomeView';
import { HeaderNav } from '../src/components/HeaderNav';
import { LiteracyView } from '../src/components/LiteracyView';
import { ReadingHallView } from '../src/components/ReadingHallView';

const source: {periods: {lines: {char:string;pinyin:string}[][]}[]} = JSON.parse(fs.readFileSync(new URL('../src/data/qianziwenSource.json',import.meta.url),'utf8'));
const sourcePairs = source.periods.flatMap(p=>p.lines.flat());
assert.equal(UNITS_DATA.length,125);
assert.equal(PERIODS_DATA.length,8);
assert.deepEqual(UNITS_DATA.flatMap(u=>u.characters.map(({char,pinyin})=>({char,pinyin}))),sourcePairs);
for(const unit of UNITS_DATA) {
  assert.equal(unit.fullText,`${unit.characters.slice(0,4).map(c=>c.char).join('')}，${unit.characters.slice(4).map(c=>c.char).join('')}。`);
  for(const c of unit.characters) {
    assert.equal(c.toneNumber,getTone(c.pinyin));
    const options = generateToneVariants(c.pinyin);
    assert.equal(new Set(options).size,4);
    assert(options.includes(c.pinyin),`Missing correct option: ${c.char} ${c.pinyin}`);
    assert(!options.some(p=>/[ˊˇˋ]/.test(p)));
  }
}
assert.equal(getTone('shang'),0);
assert.deepEqual(generateToneVariants('liú'),['liū','liú','liǔ','liù']);
assert.deepEqual(generateToneVariants('lǜ'),['lǖ','lǘ','lǚ','lǜ']);
const noop=()=>{};
const home=renderToStaticMarkup(<HomeView onSelectTab={noop} currentUnit={UNITS_DATA[0]} stars={0} completedUnitsCount={0}/>);
const header=renderToStaticMarkup(<HeaderNav currentTab="HOME" onSelectTab={noop} stars={0} isMuted={false} onToggleMute={noop}/>);
assert(!/翻翻乐/.test(home+header));
for(const index of [0,16,112,124]) {
  const unit=UNITS_DATA[index];
  const literacy=renderToStaticMarkup(<LiteracyView currentUnit={unit} allUnits={UNITS_DATA} onSelectUnit={noop} onCharacterLearned={noop}/>);
  assert.equal((literacy.match(/<option /g)??[]).length,125);
  const reading=renderToStaticMarkup(<ReadingHallView currentUnit={unit} allUnits={UNITS_DATA} onSelectUnit={noop}/>);
  for(const c of unit.characters) {assert(literacy.includes(c.pinyin));assert(reading.includes(c.pinyin));}
}
console.log('PASS: 8 periods / 125 units / all 1000 source pairs; all tone options; home/navigation feature removal; first/middle/last lesson rendering.');
