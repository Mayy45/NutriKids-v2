const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = [
  {
    method: "GET",
    path: "/save-menu/{userId}",
    handler: async (request, h) => {
      const { userId } = request.params;
      try {
        const savedMenus = await prisma.savedMenu.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return h
          .response({
            status: "success",
            data: savedMenus,
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Failed to fetch saved menu",
          })
          .code(500);
      }
    },
  },

  {
    method: "POST",
    path: "/save-menu",
    handler: async (request, h) => {
      const { userId, menus, kategoriGizi, statusGizi } = request.payload;

      if (!userId || !Array.isArray(menus)) {
        return h
          .response({
            status: "fail",
            message: "userId dan array menus wajib dikirim.",
          })
          .code(400);
      }

      try {
        const createdMenus = await prisma.savedMenu.createMany({
          data: menus.map((menu) => ({
            userId: userId,
            kategoriGizi: kategoriGizi,
            statusGiziJson: statusGizi, 
            menuName: menu.menuName,
            ingredients: menu.ingredients,
            price: menu.price,
            protein: menu.protein,
            karbohidrat: menu.karbohidrat,
            serat: menu.serat,
            kalsium: menu.kalsium,
            fosfor: menu.fosfor,
            zat_besi: menu.zat_besi,
            natrium: menu.natrium,
            kalium: menu.kalium,
            tembaga: menu.tembaga,
            seng: menu.seng,
            vit_c: menu.vit_c,
            air: menu.air,
            energi: menu.energi,
            lemak_total: menu.lemak_total,
            createdAt: new Date(),
          })),
        });

        return h
          .response({
            status: "success",
            message: `${createdMenus.count} menu berhasil disimpan.`,
          })
          .code(201);
      } catch (error) {
        console.error(error);
        return h
          .response({
            status: "error",
            message: "Gagal menyimpan menu.",
          })
          .code(500);
      }
    },
  },

  {
    method: "DELETE",
    path: "/save-menu/{savedMenuId}",
    handler: async (request, h) => {
      const { savedMenuId } = request.params;

      try {
        const deletedMenu = await prisma.savedMenu.delete({
          where: { id: savedMenuId },
        });

        return h
          .response({
            status: "success",
            message: "Menu berhasil dihapus.",
            data: deletedMenu, 
          })
          .code(200);
      } catch (error) {
        if (error.code === "P2025") {
          return h
            .response({
              status: "fail",
              message: "Menu tidak ditemukan.",
            })
            .code(404);
        }

        console.error(error);
        return h
          .response({
            status: "error",
            message: "Gagal menghapus menu.",
          })
          .code(500);
      }
    },
  },
];
