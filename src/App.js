import { useState, useEffect } from 'react';
import './App.css';

const colorsOnlySize = 8;

function unicodeRange(start, end) {
  let len = end - start;
  return [...Array(len).keys()].map(d => String.fromCharCode(d + start));
}

const dictionary = [
  ...unicodeRange(48, 58),
  ...unicodeRange(97, 123),
  ...unicodeRange(1488, 1515),
  ...unicodeRange(12459, 12526),
  ...unicodeRange(12363, 12430),
  ...unicodeRange(5792, 5881),
  ...unicodeRange(12688, 12704),
];

function _toString(num, radix) {
  let out = "";

  while (num > 0) {
    let rem = num % radix;
    num = Math.floor(num / radix);

    out = dictionary[rem] + out;
  }

  return out;
}

function _parseInt(s, radix) {
  let sum = 0;

  [...s].forEach((v, i) => sum = sum * radix + dictionary.indexOf(v));

  return sum;
}

const tableStyle = {
  border: '1px solid #CCC',
  borderCollapse: 'collapse',
};

const tableCellStyle = {
  border: '1px solid #CCC',
  width: '2em',
  height: '2em',
}

const cellStyle = function(colors, base, val, colorsOnly) {
  let idx = _parseInt(val, base);

  let out = Object.assign({}, tableCellStyle);

  out.backgroundColor = colors[idx];

  if (colorsOnly) {
    out.boxSizing = 'border-box';
    out.width = colorsOnlySize + 'px';
    out.height = colorsOnlySize + 'px';
    out.lineHeight = '0';
  }

  return out;
}

// Yoinked: https://stackoverflow.com/a/5365036/16517697
const randomColor = () => "#" + ((1<<24)*Math.random() | 0).toString(16);

function App() {
  const [base, setBase] = useState(10);
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorsOnly, setColorsOnly] = useState(false);

  useEffect(() => {
    let mulTable = [];
    for (let y = 1; y < base; y++) {
      for (let x = 1; x < base; x++) {
        mulTable.push(_toString((x * y), base));
      }
    }

    const digitalRoots = mulTable.map(val => {
      while ([...val].length > 1) {
        val = _toString([...val]
            .map(d => _parseInt(d, base))
            // Sum all values
            .reduce((p, c) => p + c, 0), base);
      }

      return val;
    }).reverse();

    let rows = [];

    for (let x = 0; x < base - 1; x++) {
      let row = [];
      for (let y = 0; y < base - 1; y++) {
        row.push(digitalRoots.pop());
      }

      rows.push(row);
    }

    setData(rows);

    let colors = [];
    for (let i = 0; i < base * 2; i++) {
      colors.push(randomColor());
    }

    setColors(colors);

  }, [base]);

  let handleToggleColorsOnly = (e) => {
    setColorsOnly(e.target.checked);
  };

  let ts = Object.assign({}, tableStyle);

  if (colorsOnly) {
    ts.width = colorsOnlySize * base + 'px';
    ts.height = colorsOnlySize * base + 'px';
  } else {
    ts.width = 2 * base + 'em';
    ts.height = 2 * base + 'em';
  }

  return (
    <div className="App">
      <header className="App-header">
        <label>
          Numeric Base:&nbsp;
          <input id="base-input" type="number" min={2} max={dictionary.length} defaultValue={base} onChange={(e) => setBase(parseInt(e.target.value))} />
          <br />
          <input type="checkbox" id="colors-only" value="colors-only" onChange={handleToggleColorsOnly} />
          <label for="colors-only">Colors Only</label>
        </label>

        <table style={ts}>
          <tbody>
          { data.map(row =>
            <tr>
              { row.map((v, i) =>
                  <td key={i} style={cellStyle(colors, base, v, colorsOnly)}>{ colorsOnly ? null : v }</td>
              )}
            </tr>
          )}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
