const { PrismaClient } = require('@prisma/client');
const { data } = require('@tensorflow/tfjs');
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

function switchAgeRange(ageRange) {
    switch (ageRange) {     
      case "AGE_0_6_MONTHS":
        return "0-6 months";
      case "AGE_6_12_MONTHS":
        return "6-12 months";
      case "AGE_1_2_YEARS":
        return "1-2 years";
      case "AGE_2_5_YEARS":
        return "2-5 years";
      case "AGE_5_12_YEARS":
        return "5-12 years";
      default:
        return null;
    }
}

module.exports = [
    {
        method: 'GET',
        path: '/users',
        handler: async (req, h) => {
            try {
                const auth = req.headers.authorization;
                if (!auth || !auth.startsWith('Bearer ')) {
                    return h.response({ message: 'Unauthorized' }).code(401);
                }

                const token = auth.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                if(decoded.email !== 'admin@gmail.com'){
                  return h.response({ message: "Tidak ditemukan"}).code(403);
                }

                const user = await prisma.user.findMany({
                    select: {
                        id_user: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        ageRange: true
                    }
                });

                const formatAgeRange = user.map(u => ({
                    ...u,
                    ageRange: switchAgeRange(u.ageRange)
                }))
                return h.response({user: formatAgeRange}).code(200);
            }catch (err) {
                console.error('Error fetching user', err)
                return h.response({ message: 'Server error', error: err.message}).code(500);
            }
        }
    },
    {
       method: 'DELETE',
       path: '/users/{idUser}',
       handler: async (req, h) => {
        const idUser = req.params;

        try {
          const user = await prisma.user.delete({
            where: { id_user: idUser.idUser}
          })
          return h.response({
            status: "success",
            message: "User Berhasil Dihapus",
            data: user
          }).code(200);
        } catch (error) {
          return h.response({
            status: "Failed",
            message: "Gagal menghapus user",
          }).code(500);
        }
       }
    }
]