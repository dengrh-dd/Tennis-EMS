package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Admin;
import java.util.List;

public interface AdminDAO {

    int insert(Admin admin);

    List<Admin> getAll();

    Admin getById(int id);

    Admin getByUserId(int userId);

    boolean update(Admin admin);

    boolean delete(int id);
}
