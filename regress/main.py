import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import SGDRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split

file_name = 'D:\\worktemp\\getData\\data\\temp.csv'
listData = pd.read_csv(file_name)
# drop unused data
listData = listData.drop(['NearestStation', 'TimeToNearestStation', 'PricePerUnit', 'UnitPrice', 'Period'], axis=1)
numeric_features = [
    'Area',
    'Frontage',
    'BuildingYear',
    'TotalFloorArea',
    'Breadth',
    'CoverageRatio',
    'FloorAreaRatio']
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer())])

categorical_features = [
    'Type',
    'Region',
    'MunicipalityCode',
    'Prefecture',
    'Municipality',
    'DistrictName',
    'FloorPlan',
    'LandShape',
    'Structure',
    'Use',
    'Purpose',
    'Direction',
    'Classification',
    'CityPlanning',
    'Renovation',
    'Remarks']
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))])

code_features = [
    'MunicipalityCode']
code_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value=np.nan)),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features)])
        #('cat', categorical_transformer, categorical_features),
        #('code', code_transformer, code_features)])

sgdregressor = SGDRegressor(loss='epsilon_insensitive')
mlpregressor = MLPRegressor(solver='sgd', hidden_layer_sizes=(10, 10, 10))

clf = Pipeline(steps=[('preprocessor', preprocessor),
                      ('regressor', sgdregressor)])

oX = listData.drop('TradePrice', axis=1)
oy = listData['TradePrice']

X_train, X_test, y_train, y_test = train_test_split(oX[numeric_features], oy, test_size=0.2)

clf.fit(X_train, y_train)
print(clf.score(X_test, y_test))
