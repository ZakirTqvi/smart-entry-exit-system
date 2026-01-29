import bcrypt from "bcryptjs";

const password = "guard123"; // 🔴 yahan apna naya password likho

const hashPassword = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed Password:\n", hashedPassword);
};

hashPassword();
