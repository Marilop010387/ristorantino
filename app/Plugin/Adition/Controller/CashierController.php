<?php

class CashierController extends AditionAppController {

	var $helpers = array('Html', 'Form');
	var $uses = array('Mozo','Mesa');
	var $components = array( 'Printer', 'RequestHandler', 'Email');
	
	
//	var $layout = 'cajero';


	
	function reiniciar(){
		debug(exec('sudo reboot'));
		die("Aguarde, el servidor esta reiniciando. Esto puede demorar unos minutos...");
	}

        function apagar(){
		debug(exec('sudo halt'));
		die("El servidor se esta apagando");
	}


        function cierre_z(){
		$this->Printer->imprimirCierreZ();

                if (! $this->RequestHandler->isAjax()) {
                    $this->Session->setFlash("Se imprimió un Cierre Z");
                    $this->redirect($this->referer());
                }
            }
	
	
	function cierre_x(){
		$this->Printer->imprimirCierreX(); 
		
                if (! $this->RequestHandler->isAjax()) {
                    $this->Session->setFlash("Se imprimió un reporte X");
                    $this->redirect($this->referer());
                }
	}

        function nota_credito(){
		if (!empty($this->data)) {
                    $cliente = array();
                    if(!empty($this->data['Cliente']) && $this->data['Cajero']['tipo'] == 'A'){
                        $cliente['razonsocial'] = $this->data['Cliente']['razonsocial'];
                        $cliente['numerodoc'] = $this->data['Cliente']['numerodoc'];
                        $cliente['respo_iva'] = $this->data['Cliente']['respo_iva'];
                        $cliente['tipodoc'] = $this->data['Cliente']['tipodoc'];
                    }
                    
                    $this->Printer->imprimirNotaDeCredito(
                            $this->data['Cajero']['numero_ticket'],
                            $this->data['Cajero']['importe'],
                            $this->data['Cajero']['tipo'],
                            $this->data['Cajero']['descripcion'],
                            $cliente
                            );
                    $this->Session->setFlash("Se imprimió una nota de crédito");
                }
	}

	
	
	
	function vaciar_cola_impresion_fiscal($devName = null){
            $this->autoRender = false;
//		$this->Printer->eliminarComandosEncolados();

                // reinicia el servidor de impresion
		comandosDeReinicializacionServidorImpresion($devName);
                return 1;die;
	}

        function listar_dispositivos(){            
            echo "<br>";
            echo exec('ls /dev/tty*');
            die;
        }
	
	
	
	function print_dnf(){		
		$this->Printer->printDNF();
		
		$this->Session->setFlash("Se imprimió documento no fiscal");
		
		die("se imprimio un DNF");
	}
	
	
	
	function cobrar()
	{		
		$this->set('tipo_de_pagos', $this->Mesa->Pago->TipoDePago->find('list'));	
	}
	
	
	function ajax_mesas_x_cobrar(){
		$this->RequestHandler->setContent('json', 'text/x-json');

		$this->layout = 'default';
		$mesas = $this->Mesa->todasLasCerradas();
	
		$this->set('mesas_cerradas', $mesas);
	}

	
}
