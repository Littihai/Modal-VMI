let data = [];
  let editIndex = -1;
  const rowsPerPage = 5;
  let currentPage = 1;

function addOrUpdateRow() {
  const lotVendor = document.getElementById('lotVendor').value.trim();
  const qty = document.getElementById('qty').value.trim();

  if (!lotVendor || !qty) return alert("กรุณากรอกข้อมูลให้ครบ");

  // ❗ ตรวจสอบ Vendor Lot ซ้ำ (ยกเว้นตอนกำลังแก้ไขตัวเดิม)
  const isDuplicate = data.some((item, index) => 
    item.lotVendor.toLowerCase() === lotVendor.toLowerCase() && index !== editIndex
  );

  if (isDuplicate) {
    alert("Vendor Lot ซ้ำ! กรุณากรอกค่าใหม่");
    return;
  }

  if (editIndex === -1) {
    data.push({ lotVendor, qty });
  } else {
    data[editIndex] = { lotVendor, qty };
    editIndex = -1;
    document.querySelector("button[onclick='addOrUpdateRow()']").innerText = "Add";
  }

  document.getElementById('lotVendor').value = '';
  document.getElementById('qty').value = '';
  renderTable();
}

  function editRow(index) {
    const item = data[index];
    document.getElementById('lotVendor').value = item.lotVendor;
    document.getElementById('qty').value = item.qty;
    editIndex = index;
    document.querySelector("button[onclick='addOrUpdateRow()']").innerText = "Update";
  }

  function deleteRow(index) {
    data.splice(index, 1);
    if (editIndex === index) {
      editIndex = -1;
      document.getElementById('lotVendor').value = '';
      document.getElementById('qty').value = '';
      document.querySelector("button[onclick='addOrUpdateRow()']").innerText = "Add";
    }
    if (currentPage > Math.ceil(data.length / rowsPerPage)) {
      currentPage = Math.max(1, currentPage - 1);
    }
    renderTable();
  }
    const qtyInput = document.getElementById('qty');

    // ห้ามพิมพ์ . และ e (ป้องกันวิธีการพิมพ์ค่าทศนิยม เช่น 1e5)
    qtyInput.addEventListener('keydown', function(e) {
    if (e.key === '.') {
        e.preventDefault();
    }
    });

    // ห้ามวางค่าที่มี .
    qtyInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/\./g, '');
    });

 function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((item, i) => {
        const actualIndex = start + i;
        const rowNumber = actualIndex + 1;
        const row = tbody.insertRow();

        const cellNo = row.insertCell(0);
        cellNo.innerText = rowNumber;
        cellNo.className = "text-center";

        const cellLot = row.insertCell(1);
        cellLot.innerText = item.lotVendor;
        cellLot.className = "text-center";

        const cellQty = row.insertCell(2);
        cellQty.innerText = Number(item.qty).toLocaleString();
        cellQty.className = "text-center";

        const cellActions = row.insertCell(3);
        cellActions.innerHTML = `
            <button class="btn btn-sm btn-primary me-1" onclick="editRow(${actualIndex})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteRow(${actualIndex})">Delete</button>
        `;
        cellActions.className = "text-center";
    });

    renderPagination();
  }

  function renderPagination() {
    const pageCount = Math.ceil(data.length / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevClass = currentPage === 1 ? 'disabled' : '';
    const nextClass = currentPage === pageCount || pageCount === 0 ? 'disabled' : '';

    pagination.innerHTML += `
      <li class="page-item ${prevClass}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
      </li>
    `;

    for (let i = 1; i <= pageCount; i++) {
      pagination.innerHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>
      `;
    }

    pagination.innerHTML += `
      <li class="page-item ${nextClass}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
      </li>
    `;
  }

  function changePage(page) {
    const pageCount = Math.ceil(data.length / rowsPerPage);
    if (page >= 1 && page <= pageCount) {
      currentPage = page;
      renderTable();
    }
  }

function saveAndClose() {
  const outputList = document.getElementById("outputList");
  outputList.innerHTML = ''; // ล้างค่าก่อน
//   const result = data.map(item => `${item.lotVendor} = ${item.qty}`).join(' | ');
  const result = data.map(item => `${item.lotVendor} = ${Number(item.qty).toLocaleString()}`).join(' | ');

  outputList.innerText = result;

  const modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
  modal.hide();
}