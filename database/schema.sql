-- Drop table if already exists
drop table destinations;

-- Create table dept_manager
create table destinations (
	dest_id serial primary key,
	address varchar(200) not null,
	latitude double precision not null,
	longitude double precision not null
);

select * from destinations;