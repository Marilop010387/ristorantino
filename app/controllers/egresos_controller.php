<?php
class EgresosController extends AppController {

	var $helpers = array('Html', 'Form', 'Ajax', 'Javascript', 'Paginator');
        //var $components = array ('Pagination'); // Added

	function index() {
		$this->Egreso->recursive = 0;
		$this->set('egresos', $this->paginate());
                if ($this->RequestHandler->isAjax()) {
                    $this->render('ajax/index');
                }
                $this->set('tipofacturas', $this->Egreso->TipoFactura->find('list'));
	}


        function ajax_agregar_gasto() {
            if (!empty($this->data)) {
                    $this->Egreso->create();
                    if ($this->Egreso->save($this->data)) {
                            $this->Session->setFlash(__('The Egreso has been saved', true));
                            $this->redirect(array('action' => 'index'));
                    } else {
                            $this->Session->setFlash(__('The Egreso could not be saved. Please, try again.', true));
                    }
            }
        }

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid Egreso', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->set('egreso', $this->Egreso->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->Egreso->create();
			if ($this->Egreso->save($this->data)) {
				$this->Session->setFlash(__('The Egreso has been saved', true));
				//die("lo mate");
                                $this->redirect('/egresos/index');
                                /*
                                if ($this->RequestHandler->isAjax()) {
                                    $this->Egreso->recursive = 0;
                                    $this->set('egresos', $this->paginate());
                                    $this->render('ajax/index');
                                }
                                 */
			} else {
				$this->Session->setFlash(__('The Egreso could not be saved. Please, try again.', true));

                                if ($this->RequestHandler->isAjax()) {
                                    $this->Session->setFlash(__('Los valores ingresados son incorrectos.', true));
                                    $this->Egreso->recursive = 0;
                                    $this->set('egresos', $this->paginate());
                                    $this->render('ajax/add');
                                }

			}
		}

               
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid Egreso', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->Egreso->save($this->data)) {
				$this->Session->setFlash(__('The Egreso has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The Egreso could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Egreso->read(null, $id);
		}
	}

	function delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for Egreso', true));
			$this->redirect(array('action' => 'index'));
		}
		if ($this->Egreso->del($id)) {
			$this->Session->setFlash(__('Egreso deleted', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->Session->setFlash(__('The Egreso could not be deleted. Please, try again.', true));
		$this->redirect(array('action' => 'index'));
	}

}
?>