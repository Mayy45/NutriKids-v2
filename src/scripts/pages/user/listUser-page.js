import Swal from "sweetalert2";
import { ApiBackend } from "../../../api/index.js";

const TableUser = {
  currentPage: 1,
  pageSize: 5,
  users: [],

  async render() {
    return `
      <section class="user-section">
        <h2>Daftar Pengguna</h2>
        <table id="user-table" class="user-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Usia</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="user-table-body"></tbody>
        </table>

        <div class="pagination">
          <button id="prev" disabled>Previous</button>
          <span id="pageInfo"></span>
          <button id="next" disabled>Next</button>
        </div>
      </section>`;
  },

  async afterRender() {
    await this.fetchUsers();
    this.renderTable();
    this.setupPaginationButtons();
  },

  async fetchUsers() {
    try {
      Swal.fire({ title: "Memuat daftar pengguna...", didOpen: () => Swal.showLoading() });
      const response = await ApiBackend.get("/users");
      this.users = response.data.user || [];
      Swal.close();
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Gagal memuat data",
        text: error.message || "Terjadi kesalahan saat mengambil data pengguna.",
        icon: "error",
      });
    }
  },

  renderTable() {
    const tbody = document.getElementById("user-table-body");
    const pageInfo = document.getElementById("pageInfo");
    if (!tbody || !pageInfo) return;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageUsers = this.users.slice(start, end);

    tbody.innerHTML = pageUsers
      .map(
        (user) => `
      <tr>
        <td>${user.firstName || "-"}</td>
        <td>${user.ageRange || "Tidak diketahui"}</td>
        <td>${user.email}</td>
        <td>${user.phone || "Tidak diketahui"}</td>
        <td><button class="delete-user" data-id="${user.id_user}">Hapus</button></td>
      </tr>`
      )
      .join("");

    pageInfo.textContent = `Page ${this.currentPage} of ${Math.ceil(this.users.length / this.pageSize)}`;

    // delete button
    document.querySelectorAll(".delete-user").forEach((btn) => {
      btn.addEventListener("click", (event) => this.handleDelete(event));
    });

    // update button state
    document.getElementById("prev").disabled = this.currentPage === 1;
    document.getElementById("next").disabled = this.currentPage >= Math.ceil(this.users.length / this.pageSize);
  },

  setupPaginationButtons() {
    document.getElementById("prev").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
      }
    });

    document.getElementById("next").addEventListener("click", () => {
      if (this.currentPage < Math.ceil(this.users.length / this.pageSize)) {
        this.currentPage++;
        this.renderTable();
      }
    });
  },

  async handleDelete(event) {
    const userId = event.target.dataset.id;
    const confirmDelete = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus pengguna ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await ApiBackend.delete(`/users/${userId}`);
        this.users = this.users.filter((u) => u.id_user !== userId);
        // jika halaman terakhir kosong setelah delete, pindah ke page sebelumnya
        const totalPages = Math.ceil(this.users.length / this.pageSize);
        if (this.currentPage > totalPages) this.currentPage = totalPages || 1;
        this.renderTable();
        Swal.fire({ title: "Berhasil", text: "Pengguna berhasil dihapus.", icon: "success" });
      } catch (error) {
        Swal.fire({
          title: "Gagal",
          text: error.response?.data?.message || "Terjadi kesalahan saat menghapus pengguna.",
          icon: "error",
        });
      }
    }
  },
};

export default TableUser;
