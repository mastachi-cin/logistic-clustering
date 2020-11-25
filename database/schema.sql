-- Drop table if already exists
drop table destinations;

-- Create table dept_manager
create table destinations (
	dest_id serial primary key,
	city varchar(50) not null,
	state varchar(50) not null,
	longitude double precision not null,
	latitude double precision not null
);