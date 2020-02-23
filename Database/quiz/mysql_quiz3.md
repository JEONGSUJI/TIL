### quiz 3



1. 멕시코보다 인구가 많은 나라이름과 인구수를 조회하시고 인구수 순으로 내림차순하세요
   
   ```mysql
   
   ```

   
   
2. 국가별 몇개의 도시가 있는지 조회하고 도시수 순으로 10위까지 내림차순하세요

   ```mysql
   
   ```

   

3. 언어별 사용인구를 출력하고 언어 사용인구 순으로 10위까지 내림차순하세요.

   ```mysql
   
   ```

   

4. 나라 전체 인구의 10% 이상인 도시에서 도시 인구가 500만이 넘는 도시를 아래와 같이 조회하세요.

   ```mysql
   
   ```

   

5. 면적이 10000km^2 이상인 국가의 인구밀도()를 구하고 인구밀도가 200이상인 국가들의 사용하고 있는 언어수가 5가지 이상인 나라를 조회하세요

   ```mysql
   
   ```

   

6. 사용하는 언어가 3가지 이하인 국가중 도시인구가 300만 이상인 도시를 아래와 같이 조회하세요

   ```mysql
   use world
   
   select sub.countrycode, sub.name as city_name, sub.population, country.name, sub.language_count, sub.languages
   from(
   	select city.countrycode, city.name, city.population, cl.language_count, cl.languages
   from(
   	select countrycode, GROUP_CONCAT(language) as languages, count(language) as language_count
   	from countrylanguage
   	group by countrycode
   	having language_count <= 3
   ) as cl
   join(
   	select countrycode, name, population
   	from city
   	where population > 3000000
   ) as city
   on cl.countrycode = city.countrycode
   ) as sub
   join country
   on country.code = sub.countrycode
   order by population desc
   ```

   

7. 한국과 미국의 인구를 아래와 같이 나타내세요.

   피보팅한거라 select에 조건문을 하면 된다.

   ```mysql
   select "population" as "category",
   		sum(sub.KOR) as KOR,
           sum(sub.USA) as USA
   from(
   	select if(code="KOR", population, 0) as KOR, if(code="USA", population, 0) as USA, 1 as flag
   	from country
       having KOR > 0 OR USA > 0
   )as sub
   group by flag
   ```

8. payment 테이블에서 수입의 총합을 아래와 같이 출력하세요

   ```mysql
   use sakila;
   
   select sum(sub.date1), sum(sub.date2), sum(sub.date3), sum(sub.date4), sum(sub.date5)
   from (
   select
   	sum(if(DATE_FORMAT(payment_date, "%Y-%m")="2005-05", amount, 0)) as date1,
       sum(if(DATE_FORMAT(payment_date, "%Y-%m")="2005-06", amount, 0)) as date2,
       sum(if(DATE_FORMAT(payment_date, "%Y-%m")="2005-07", amount, 0)) as date3,
       sum(if(DATE_FORMAT(payment_date, "%Y-%m")="2005-08", amount, 0)) as date4,
       sum(if(DATE_FORMAT(payment_date, "%Y-%m")="2006-02", amount, 0)) as date5,
       "tmp"
   from payment    
   group by DATE_FORMAT(payment_date, "%Y-%m")    
   ) as sub
   group by tmp
   ```

   

9. Quiz 8의 결과에서 payment 테이블에서 월별 렌트 횟수 데이터를 추가하여 아래와 같이 출력하세요. (년월 데이터를 쿼리문에 문자열로 사용해도 된다.)

   ```mysql
   
   ```

   

