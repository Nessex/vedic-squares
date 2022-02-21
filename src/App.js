import { useState, useEffect } from 'react';
import './App.css';

const tableStyle = {
  border: '1px solid #CCC',
  borderCollapse: 'collapse',
};

const tableCellStyle = {
  border: '1px solid #CCC',
  width: '2em',
  height: '2em',
}

const cellStyle = function(colors, base, val) {
  let idx = parseInt(val, base);

  let out = Object.assign({}, tableCellStyle);

  out.backgroundColor = colors[idx];

  return out;
}

const randomColor = () => "#" + ((1<<24)*Math.random() | 0).toString(16);

function App() {
  const [base, setBase] = useState(7);
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    let mulTable = [];
    for (let y = 1; y < base; y++) {
      for (let x = 1; x < base; x++) {
        mulTable.push((x * y).toString(base));
      }
    }

    const digitalRoots = mulTable.map(val => {
      while (val.length > 1) {
        val = val.split("")
            .map(d => parseInt(d, base))
            // Sum all values
            .reduce((p, c) => p + c, 0).toString(base);
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
    for (let i = 0; i < base; i++) {
      colors.push(randomColor());
    }

    setColors(colors);

  }, [base]);

  return (
    <div className="App">
      <header className="App-header">
        <label>
          Numeric Base:&nbsp;
          <input id="base-input" type="number" min={2} max={36} defaultValue={base} onChange={(e) => setBase(parseInt(e.target.value))} />
        </label>

        <table style={tableStyle}>
          { data.map(row =>
            <tr>
              { row.map(v =>
                  <td style={cellStyle(colors, base, v)}>{v}</td>
              )}
            </tr>
          )}
        </table>
      </header>
    </div>
  );
}

export default App;
