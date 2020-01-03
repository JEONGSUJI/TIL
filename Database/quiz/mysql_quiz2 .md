### quiz 2



1. 전체 몇개의 대륙이 있는지 출력하세요.
   
   ```mysql
   use world;
   select count(Continent) as count
from country;
   ```
   
2. 국가 코드별 도시의 개수를 출력하세요 (상위 5개를 출력)
   
   ```mysql
   # use world;
   select CountryCode, count(CountryCode) as count
   from city
   group by CountryCode
   order by count desc
limit 5;
   ```

   + +. 대륙별 GNP 총량을 출력하는 컬럼 추가
   
   ```mysql
   select CountryCode, count(CountryCode) as count, sum(gnp) as total_gnp, avg(gnp) as total_gnp, sum(population) as tatal_popu, (sum(gnp) / sum(population)) * 100 as gpp
   from country
   group by continent
order by count desc;
   ```

3. 대륙별 몇개의 나라가 있는지 대륙별 나라의 개수로 내림차순하여 출력하세요.

   ```mysql
   select continent, count(continent) as count
   from country
   group by continent
   order by count desc;
   ```

4.  대륙별 인구가 1000만명 이상인 나라의 수와 GNP의 표준편차를 출력하세요. (GNP 표준편차로 내림차순)

   ```mysql
   # GNP의 표준편차를 모르겠음 우선 GNP 더한 값을 넣어놈
   select Continent, count(Continent) as count, sum(GNP) as std_gng
   from country
   where Population >= 10000000
   group by Continent
   ```

5. City 테이블에서 국가코드별로 총 인구가 몇명인지 조회하고 총 인구 순으로 내림차순 하세요. (총 인구가 5천만 이상인 도시만 출력)

   ```mysql
   SELECT CountryCode, sum(Population) as Population
   FROM city
   group by CountryCode
   HAVING Population >= 50000000
   order by Population DESC
   ```

6.  언어별 사용하는 국가수를 조회하고 많이 사용하는 언어를 6위에서 10위까지 조회하세요.

   ```mysql
   select Language, count(Language) as count
   FROM countrylanguage
   group by Language
   ORDER BY count DESC
   limit 5, 5
   ```

7.  언어별 15곳 이상의 국가에서 사용되는 언어를 조회하고, 언어별 국가수에 따라 내림차순하세요.

   ```mysql
   select Language, count(Language) as count
   from countrylanguage
   group by Language
   order by count desc
   ```

8. 대륙별 전체 표면적 크기를 구하고 표면적 크기 순으로 내림차순하세요.

   ```mysql
   select Continent, sum(SurfaceArea) as SurfaceArea
   from country
   group by Continent
   order by SurfaceArea DESC
   ```

