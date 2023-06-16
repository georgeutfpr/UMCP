CREATE TABLE backup_alunos (
	data TIMESTAMP,
	usuario VARCHAR(45),
	ra INT,
    nome VARCHAR(255),
    curso VARCHAR(45),
    periodo INT,
    turno VARCHAR(10)
);

-- Deletes
CREATE OR REPLACE FUNCTION DeleteTurmas(RA INT) RETURNS void AS $$
DECLARE
BEGIN
    DELETE FROM turmas WHERE "alunos_RA" = RA;
END; 
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION BackupAlunos() RETURNS TRIGGER AS $$
BEGIN 
    PERFORM DeleteTurmas(OLD.ra);
    INSERT INTO backup_alunos (data, usuario, RA, Nome, Curso, Periodo, Turno)
    VALUES (current_timestamp, current_user, OLD.ra, OLD.nome, OLD.curso, OLD.periodo, OLD.turno);
    RETURN OLD;
END; 
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER BackupAluno BEFORE DELETE ON alunos 
FOR EACH ROW EXECUTE FUNCTION BackupAlunos();

CREATE OR REPLACE FUNCTION DeleteDepartamentos() RETURNS TRIGGER AS $$
DECLARE 
LINE record;
BEGIN 
	FOR LINE IN SELECT nome from cursos where departamento = OLD.SIGLA
		LOOP 
			DELETE FROM ALUNOS WHERE curso = LINE.nome ;
		END LOOP;
		DELETE FROM CURSOS WHERE departamento = OLD.sigla;
		raise notice 'ATENÇÃO: houveram CURSOS e/ou ALUNOS excluídos!!!';
    RETURN OLD;
END; 
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION DeleteMateria() RETURNS TRIGGER AS $$
DECLARE 
LINE record;
BEGIN 
	FOR LINE IN SELECT codigo from turmas where materia_codigo = OLD.CODIGO
		LOOP 
			DELETE FROM turmas WHERE materia_codigo = LINE.codigo;
		END LOOP;
	raise notice 'ATENÇÃO: houveram TURMAS excluídos!!!';
    RETURN OLD;
END; 
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION DeleteCurso() RETURNS TRIGGER AS $$
BEGIN 
	DELETE FROM Alunos WHERE curso = OLD.nome;	
	raise notice 'ATENÇÃO: houveram ALUNOS excluídos!!!';
    RETURN OLD;
END; 
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER Delete_FK_Curso BEFORE DELETE ON Cursos
FOR EACH ROW EXECUTE FUNCTION DeleteCurso();

CREATE TRIGGER Delete_FK_Materia BEFORE DELETE ON Materia
FOR EACH ROW EXECUTE FUNCTION DeleteMateria();

CREATE TRIGGER Delete_FK_Dep BEFORE DELETE ON Departamentos 
FOR EACH ROW EXECUTE FUNCTION DeleteDepartamentos();


CREATE OR REPLACE FUNCTION AtualizaMateria() RETURNS TRIGGER AS $$
DECLARE 
LINE record;
BEGIN 
	FOR LINE IN SELECT codigo from turmas where materia_codigo = OLD.CODIGO
		LOOP 
			UPDATE turmas set materia_codigo = new.codigo WHERE materia_codigo = OLD.codigo;
		END LOOP;
	raise notice 'ATENÇÃO: houveram TURMAS Atualizadas!!!';
    RETURN NEW;
END; 
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION AtualizaCursos() RETURNS TRIGGER AS $$ 
BEGIN 
	UPDATE Alunos set nome = new.nome WHERE nome = OLD.nome;
	raise notice 'ATENÇÃO: houveram CURSOS de alunos atualizados!!!';
	RETURN NEW;
END; $$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION AtualizaDepartamentos() RETURNS TRIGGER AS $$ 
BEGIN 
	IF (OLD.SIGLA <> NEW.SIGLA) 
	THEN
		UPDATE cursos set departamento = NEW.SIGLA WHERE departamento = OLD.SIGLA ;
	END IF;
    RETURN NEW;
END; $$ LANGUAGE PLPGSQL;
	
CREATE TRIGGER Update_FK_Cursos BEFORE UPDATE ON Cursos
FOR EACH ROW EXECUTE FUNCTION AtualizaCursos();

CREATE TRIGGER Update_FK_Materia BEFORE UPDATE ON Materia 
FOR EACH ROW EXECUTE FUNCTION AtualizaMateria();

CREATE TRIGGER Update_FK_Dep BEFORE UPDATE ON Departamentos 
FOR EACH ROW EXECUTE FUNCTION AtualizaDepartamentos();


-- Criar usuario 
CREATE USER professor WITH password 'professor';
GRANT SELECT ON alunos TO professor;
GRANT SELECT ON cursos TO professor;
GRANT SELECT ON departamentos TO professor;
GRANT SELECT ON materia TO professor;
GRANT SELECT ON turmas TO professor;

-- Criar View
CREATE OR REPLACE VIEW DadosAlunos AS
SELECT alunos.RA, cursos.departamento, cursos.nome
FROM Alunos JOIN Cursos ON alunos.CURSO = cursos.nome;

GRANT SELECT ON DadosAlunos TO professor;
GRANT INSERT ON DadosAlunos TO professor WITH GRANT OPTION;

CREATE OR REPLACE FUNCTION InsertViewTrigger() RETURNS TRIGGER AS $$
BEGIN 
	IF EXISTS (select sigla from departamentos where sigla = NEW.departamento )	
		THEN
			IF EXISTS(select nome from cursos where nome = NEW.nome) 
				THEN
				INSERT INTO Alunos values (NEW.RA,NULL,NULL,NULL,NEW.nome);
			ELSE 
				INSERT INTO Cursos values (NEW.nome,NEW.departamento);
				INSERT INTO Alunos values (NEW.RA,NULL,NULL,NULL,NEW.nome);
				
			END IF;
		ELSE
			IF EXISTS(select nome from cursos where nome = NEW.nome) 
				THEN
				INSERT INTO Departamentos values (NEW.departamento,NULL);
				INSERT INTO Alunos values (NEW.RA,NULL,NULL,NULL,NEW.nome);
			ELSE 
				INSERT INTO Departamentos values (NEW.departamento,NULL);
				INSERT INTO Cursos values (NEW.nome,NEW.departamento);
				INSERT INTO Alunos values (NEW.RA,NULL,NULL,NULL,NEW.nome);
			END IF;
		END IF;
	RETURN NEW;
END; 
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE TRIGGER Insert_INTO_View INSTEAD OF INSERT ON DadosAlunos
FOR EACH ROW EXECUTE FUNCTION InsertViewTrigger();

