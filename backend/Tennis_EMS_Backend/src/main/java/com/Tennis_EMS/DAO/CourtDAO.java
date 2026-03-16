package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.Court;

import java.util.List;

public interface CourtDAO {

    int insert(Court court);

    List<Court> getAll();

    Court getById(int id);

    Court getByLocationAndName(String location, String name);

    boolean update(Court court);

    boolean delete(int id);
}
