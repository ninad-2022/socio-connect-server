import bcrypt from "bcrypt";
import userModel from "../Models/userModel.js";

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        req.body.password = await bcrypt.hash(password, 10);
      }

      const user = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(403)
      .json("Access Denied! you can only update your own profile.");
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await userModel.findByIdAndDelete(id);
      res.status(200).json("user deleted successfully!");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(403)
      .json("Access Denied! you can only delete your own profile.");
  }
};

export const followUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  if (id == currentUserId) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await userModel.findById(id); //to whom we are following
      const followingUser = await userModel.findById(currentUserId); //who is following

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("User is Already followed by you");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  if (id == currentUserId) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await userModel.findById(id); //to whom we are following
      const followingUser = await userModel.findById(currentUserId); //who is following

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
