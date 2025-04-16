const svg = d3.select("#chart");
const width = +svg.attr("width");
const height = +svg.attr("height");
let array = [];
let stopRequested = false;

function generateArray() {
  array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10);
  drawArray(array);
  document.getElementById("status").textContent = "New array generated. Click “Run Selection Sort” to start.";
}

function drawArray(data, currentIdx = -1, minIdx = -1, sortedUpto = -1) {
  svg.selectAll("*").remove();
  const barWidth = width / data.length;

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (_, i) => {
      if (i <= sortedUpto) return "bar sorted";
      if (i === minIdx) return "bar min";
      if (i === currentIdx) return "bar current";
      return "bar";
    })
    .attr("x", (_, i) => i * barWidth)
    .attr("y", d => height - d * 3)
    .attr("width", barWidth - 5)
    .attr("height", d => d * 3);

  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (_, i) => i * barWidth + barWidth / 2)
    .attr("y", d => height - d * 3 - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#1f2937")
    .attr("font-size", "12px")
    .text(d => d);
}

async function selectionSort() {
  stopRequested = false; 
  let n = array.length;
  let arr = [...array];
  const status = document.getElementById("status");

  for (let i = 0; i < n - 1; i++) {
    if (stopRequested) {
      status.textContent = "Sorting stopped by user.";
      return;
    }

    let minIdx = i;
    status.textContent = `Looking for the smallest element from index ${i} to ${n - 1}`;
    drawArray(arr, i, minIdx, i - 1);
    await delay(500);

    for (let j = i + 1; j < n; j++) {
      if (stopRequested) {
        status.textContent = "Sorting stopped by user.";
        return;
      }

      drawArray(arr, j, minIdx, i - 1);
      await delay(300);

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        status.textContent = `New minimum found at index ${j} (Value: ${arr[j]})`;
        drawArray(arr, j, minIdx, i - 1);
        await delay(400);
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      status.textContent = `Swapped elements at index ${i} and ${minIdx}`;
      drawArray(arr, i, minIdx, i - 1);
      await delay(700);
    }

    drawArray(arr, -1, -1, i);
  }

  drawArray(arr, -1, -1, n - 1);
  status.textContent = "✅ Array is now fully sorted!";
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stopSort() {
  stopRequested = true;
}

// Auto-generate on page load
generateArray();

