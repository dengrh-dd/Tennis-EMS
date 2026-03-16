package com.Tennis_EMS.DAO;

import com.Tennis_EMS.Entity.ScoringFormat;

import java.util.List;

public interface ScoringFormatDAO {

    int insert(ScoringFormat format);

    ScoringFormat getById(int formatId);

    ScoringFormat getByName(String name);

    List<ScoringFormat> getAll();

    List<ScoringFormat> getByType(ScoringFormat.FormatType type);

    List<ScoringFormat> getActive();

    boolean update(ScoringFormat format);

    boolean delete(int formatId);
}
