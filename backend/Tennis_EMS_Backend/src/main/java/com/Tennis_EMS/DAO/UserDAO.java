package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.User;

import java.util.List;

public interface UserDAO {

    int insert(User user);

    List<User> getAll();

    User getById(int id);

    User getByEmail(String email);

    boolean update(User user);

    boolean delete(int id);
}


